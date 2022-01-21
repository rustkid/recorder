#![allow(non_snake_case)]
use dioxus::prelude::*;
use wasm_bindgen::prelude::*;
use wasm_bindgen::*;
use web_sys::{BlobEvent, MediaRecorder, MediaStream, MediaStreamTrack, RecordingState};

use gloo::console;
use gloo::file::{futures::read_as_bytes, Blob};

#[allow(dead_code)]
enum Action {
    Start,
    Stop,
    Pause,
    Resume,
    Idle,
}

#[inline_props]
pub fn Recorder<'a>(
    cx: Scope<'a>,
    stream: MediaStream,
    dispathEvent: UseState<'a, bool>,
) -> Element {
    console::log!("Hello1");
    let mydata: &mut Vec<u8> = cx.use_hook(|_| vec![]);

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
    let stop = Closure::wrap(Box::new(move |_| {
        console::log!("recording stopped");
    }) as Box<dyn FnMut(JsValue)>);
    rec.set_onstop(Some(stop.as_ref().unchecked_ref()));
    stop.forget();

    console::log!("Hello4");
    // record.ondataavailable

    let mut idata = mydata.clone();
    let d = Closure::wrap(Box::new(move |blob: JsValue| {
        console::log!("Data available");
        console::log!(&blob);
        let web_sys_blob = blob.unchecked_into::<BlobEvent>().data().unwrap();
        let blob = Blob::from(web_sys_blob);
        read_as_bytes(&blob);
        idata.push(1);
        console::log!(idata.len());
    }) as Box<dyn FnMut(JsValue)>);

    rec.set_ondataavailable(Some(d.as_ref().unchecked_ref()));
    d.forget();

    console::log!("Hello5");

    match *action {
        Action::Idle => {}
        Action::Start => {
            rec.start_with_time_slice(1000).unwrap();
            console::log!("recording started");
            let state = rec.state();
            console::log!(state);
            //mydata.push(1);
            //console::log!(mydata.len());
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
                dispathEvent.set(true);
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

    /* let view = match *isRecordingOver {
        false => rsx! {
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
        },
        true => rsx! {
            div {
                style:"border: 2px solid red;",
                video{playsinline:"true", controls:"true", autoplay:"true"}
            }
        },
    }; */

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
    })
}
