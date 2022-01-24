#![allow(non_snake_case)]
use dioxus::prelude::*;
use wasm_bindgen::prelude::*;
use wasm_bindgen::*;
use web_sys::{BlobEvent, MediaRecorder, MediaStream, MediaStreamTrack, RecordingState, Url};

use gloo::file::{futures::read_as_bytes, Blob};
use gloo::{console, utils};

#[allow(dead_code)]
enum Action {
    Start,
    Stop,
    Pause,
    Resume,
    Idle,
}

#[inline_props]
pub fn Recorder<'a>(cx: Scope, stream: MediaStream, dispathEvent: UseState<'a, bool>) -> Element {
    console::log!("Hello1");

    let blobs = use_ref(&cx, || Vec::<Blob>::new());

    let isRecording = use_state(&cx, || false);
    let rec = use_state(&cx, || {
        MediaRecorder::new_with_media_stream(stream).unwrap()
    });
    let action = use_state(&cx, || Action::Idle);

    console::log!(*isRecording);
    console::log!("Hello2");
    // record.onstart
    let f = Closure::wrap(Box::new(move |_| {
        console::log!("Hai recording started");
    }) as Box<dyn FnMut(JsValue)>);
    rec.set_onstart(Some(f.as_ref().unchecked_ref()));
    f.forget();

    console::log!("Hello3");

    // record.onstop
    let stop = Closure::wrap(Box::new(move |hello| {
        console::log!(hello);
        console::log!("recording stopped");
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
            let blob = Blob::from(web_sys_blob);
            //read_as_bytes(&blob);
            blobs.write().push(blob);
            //console::log!(blobs.read().len());
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
                dispathEvent.set(true);
                console::log!(blobs.read().len());

                //playBack.src = window.URL.createObjectURL(new Blob(recordingData));
                //let k = Url::create_object_url_with_blob(blobs).unwrap();
            }
        }
        Action::Pause => {}
        Action::Resume => {}
    }

    let clickHandler = move |_| match *isRecording {
        false => {
            action.set(Action::Start);
            isRecording.set(true);
        }
        true => {
            action.set(Action::Stop);
            isRecording.set(false);
        }
    };
    console::log!("Hello6");

    cx.render(rsx! {
        article {
            style: "place-content: center; place-items: center;",
            section {
                button {
                    onclick: clickHandler,
                    section{ style: "justify-content:center;gap:0;",
                        /* span{if *isRecording {icons.stop} else {icons.record}} */
                        span{
                            match *isRecording {
                                true => rsx! {"Stop"},
                                false => rsx! {"Record"},
                            }
                        }
                    }
                }
            }
        }
        video{playsinline:"true", controls:"true", autoplay:"true"}
    })
}
