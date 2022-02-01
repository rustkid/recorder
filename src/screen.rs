#![allow(non_snake_case)]

use dioxus::prelude::*;

use crate::recorder::Recorder;
use crate::utils::Action;
use crate::utils::{cam_stream, display_stream, AV};

pub fn Screen(cx: Scope) -> Element {
    let isRecordingOver = use_ref(&cx, || false);
    let (action, set_action) = use_state(&cx, || Action::Start);

    let fut = use_future(&cx, move || async move {
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

        (audio_stream, video_stream)
    });

    let k = match fut.value() {
        None => rsx!(h1{"Waiting for permission"}),
        Some(ms) => {
            rsx!(Recorder {
                stream: &ms.0,
                stream_screen: &ms.1,
                source: "screen",
                set_action: set_action,
                isRecordingOver: isRecordingOver,
            })
        }
    };

    cx.render(rsx!(k))
}
