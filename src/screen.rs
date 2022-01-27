#![allow(non_snake_case)]

use dioxus::prelude::*;

use crate::recorder::Recorder;
use crate::utils::{cam_stream, display_stream, AV};

use gloo::console;
use wasm_bindgen::prelude::*;
use wasm_bindgen::*;
use web_sys::MediaStreamTrack;

pub fn Screen(cx: Scope) -> Element {
    let isRecordingOver = use_state(&cx, || false);

    console::log!(*isRecordingOver);
    let fut = use_future(&cx, move || {
        async move {
            let audio_stream = cam_stream(AV {
                audio: true,
                video: false,
            })
            .await
            .unwrap();
            let video_stream = display_stream(AV {
                audio: false,
                video: true,
            })
            .await
            .unwrap();

            let track = video_stream.get_video_tracks().iter().next().unwrap();
            let mst = track.unchecked_into::<MediaStreamTrack>();

            let cb = Closure::wrap(Box::new(move |_| {
                console::log!("hello fire");
            }) as Box<dyn FnMut(JsValue)>);

            mst.set_onended(Some(cb.as_ref().unchecked_ref()));
            cb.forget();

            //video_stream.active();

            (audio_stream, video_stream)
        }
    });

    let k = match fut.value() {
        None => rsx!(h1{"loading"}),
        Some(ms) => {
            rsx!(Recorder {
                stream: &ms.0,
                stream_screen: &ms.1,
                dispathEvent: isRecordingOver,
                source: "screen",
            })
        }
    };

    cx.render(rsx!(k))
}
