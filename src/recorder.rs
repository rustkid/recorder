#![allow(non_snake_case)]
use dioxus::prelude::*;
use wasm_bindgen::prelude::*;
use wasm_bindgen::*;
use web_sys::{
    Blob, BlobEvent, HtmlAnchorElement, HtmlVideoElement, MediaRecorder, MediaStream,
    MediaStreamTrack, RecordingState, Url,
};
use crate::utils::{AudioVideoMix, Action};

use gloo::{console, timers::callback::Timeout, utils};

use js_sys::Array;

#[inline_props]
pub fn Recorder<'a>(cx: Scope<'a>, stream: &'a MediaStream, stream_screen:&'a MediaStream, source: &'a str, action: &'a UseRef<Action>, callBack: UseState<'a, bool>) -> Element {
    console::log!("Hello1");

    let blobs = use_ref(&cx, || Array::new());
    
    let isRecordingOver = use_state(&cx, || false);

    let mixedStreamRecorder = match &source[..] {
        "screen" => MediaRecorder::new_with_media_stream(&AudioVideoMix(&stream, &stream_screen)).unwrap(),
        _ =>MediaRecorder::new_with_media_stream(stream).unwrap(),
    };

    let rec = use_state(&cx, || {mixedStreamRecorder});
    
    let action = use_state(&cx, || *action.read());

    {// browser native "stop sharing" button
        let track = stream_screen.get_video_tracks().iter().next().unwrap();
        let mst = track.unchecked_into::<MediaStreamTrack>();
        let cb = Closure::wrap(Box::new({

            move |_| {
            console::log!("hello fire");
            //action.set(Action::Stop); // Not able to call this.
            
        }}) as Box<dyn FnMut(JsValue)>);
        mst.set_onended(Some(cb.as_ref().unchecked_ref()));
        cb.forget();
    }

    console::log!("Hello2");
    // record.onstart
    let f = Closure::wrap(Box::new(move |_| {
        console::log!("Hai recording started");
    }) as Box<dyn FnMut(JsValue)>);
    rec.set_onstart(Some(f.as_ref().unchecked_ref()));
    f.forget();

    console::log!("Hello3");

    // record.onstop
    let stop = Closure::wrap(Box::new(move |_evt: JsValue| {
        console::log!("recording stopped kanna1");

    }) as Box<dyn FnMut(JsValue)>);
    rec.set_onstop(Some(stop.as_ref().unchecked_ref()));
    stop.forget();

    // record.ondataavailable
    let d = Closure::wrap(Box::new({
        let blobs = blobs.clone();
        move |blobEvent: JsValue| {
            console::log!("Data available");
            console::log!(&blobEvent);
            let web_sys_blob = blobEvent.unchecked_into::<BlobEvent>().data().unwrap();
            blobs.write_silent().push(&web_sys_blob);
        }
    }) as Box<dyn FnMut(JsValue)>);
    rec.set_ondataavailable(Some(d.as_ref().unchecked_ref()));
    d.forget();

    console::log!("Hello5");

    match *action {
        Action::Idle => {}
        Action::Start => {
            let state = rec.state();
            if state != RecordingState::Recording {
                rec.start_with_time_slice(1000).unwrap();
                console::log!("recording started");
                let state = rec.state();
                console::log!(state);
            }
        }
        Action::Stop => {
            let state = rec.state();
            console::log!(state);
            if state != RecordingState::Inactive {
                let stop = rec.stop();
                match stop {
                    Ok(_) => {}
                    Err(e) => console::log!(e),
                }
                //let isStopped = stop.is_ok();
                //console::log!(isStopped);
                console::log!("recording stoping....");
                let tracks = stream.get_tracks();
                for t in tracks.iter() {
                    let mst = t.unchecked_into::<MediaStreamTrack>();
                    mst.stop();
                }

                let tracks = stream_screen.get_tracks();
                for t in tracks.iter() {
                    let mst = t.unchecked_into::<MediaStreamTrack>();
                    mst.stop();
                }

                isRecordingOver.set(true);
                callBack.set(true);
                action.set(Action::Play);
            }
        }
        Action::Pause => {
            rec.pause().unwrap();
            console::log!(rec.state());
        }
        Action::Resume => {
            rec.resume().unwrap();
            console::log!(rec.state());
        }
        Action::Play => {
            console::log!(126);
            let k = blobs.read();
            let blob = Blob::new_with_buffer_source_sequence(&k).unwrap();
            let audio_url = Url::create_object_url_with_blob(&blob).unwrap();

            let timeout = Timeout::new(1_00, move || {
                //playback
                let k = utils::document()
                    .get_element_by_id("playback")
                    .unwrap()
                    .dyn_into::<HtmlVideoElement>()
                    .unwrap();
                k.set_src(&audio_url);
                //k.set_muted(true);
                //k.play();
            });
            timeout.forget();
        }
        Action::Save => {
            let k = blobs.read();
            let blob = Blob::new_with_buffer_source_sequence(&k).unwrap();
            let audio_url = Url::create_object_url_with_blob(&blob).unwrap();
            //download
            let a = utils::document()
                .create_element("a")
                .unwrap()
                .dyn_into::<HtmlAnchorElement>()
                .unwrap();
            a.set_download("kanna.webm");
            a.set_href(&audio_url);
            a.click();
        }
    }

    let startHandler = move |_| match rec.state() {
        RecordingState::Inactive => {
            action.set(Action::Start);
        }
        _ => {
            action.set(Action::Stop);
        }
    };

    let pauseHandler = move |_| match rec.state() {
        RecordingState::Recording => {
            action.set(Action::Pause);
        }
        _ => {
            action.set(Action::Resume);
        }
    };

    let saveHandler = move |_| {
        action.set(Action::Save);
    };

    console::log!("Hello6");

    cx.render(rsx! {
        article {
            style: "place-content: center; place-items: center;",
            section {
                match *isRecordingOver {
                    false => {
                        rsx!(
                            button {
                                onclick: startHandler,
                                section{ style: "justify-content:center;gap:0;",
                                    /* span{if *isRecording {icons.stop} else {icons.record}} */
                                    span{
                                        match *action {
                                            Action::Idle => rsx!("Start"),
                                            _ => rsx!{"Stop"},
                                        }
                                    }
                                }
                            }
                            if rec.state() != RecordingState::Inactive {
                                rsx!(button {
                                    onclick: pauseHandler,
                                    section{ style: "justify-content:center;gap:0;",
                                        /* span{if *isRecording {icons.stop} else {icons.record}} */
                                        span{
                                            match *action {
                                                Action::Start | Action::Resume => rsx!("Pause"),
                                                _ => rsx!("Resume"),
                                            }
                                        }
                                    }
                                })
                            } else {rsx!("")}
                        )
                    }
                    true => {
                        rsx!(button {
                            onclick: saveHandler,
                            section{ style: "justify-content:center;gap:0;",
                                span{rsx!("Save")}
                            }
                        })
                    }
                }
            }
            match *isRecordingOver {
                true => rsx!(video{id:"playback", playsinline:"true", controls:"true", autoplay:"true"}),
                false => rsx!("")
            }
        }
        
    })
}
