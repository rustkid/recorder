#![allow(non_snake_case)]

use dioxus::prelude::*;

use crate::recorder::Recorder;
use crate::utils::AudioVideoMix;

use gloo::{console, utils};
use wasm_bindgen::*;
use wasm_bindgen_futures::JsFuture;
use web_sys::{
    DisplayMediaStreamConstraints, HtmlMediaElement, MediaStream, MediaStreamConstraints,
    MediaStreamTrack,
};

async fn cam_stream() -> Result<MediaStream, JsValue> {
    let md = utils::window().navigator().media_devices().unwrap();
    let mut constraints = MediaStreamConstraints::new();
    constraints.video(&JsValue::from(false));
    constraints.audio(&JsValue::from(true));
    let gum = md.get_user_media_with_constraints(&constraints).unwrap();
    console::log!("permission granted");
    JsFuture::from(gum).await.map(MediaStream::from)
}

async fn display_stream() -> Result<MediaStream, JsValue> {
    let md = utils::window().navigator().media_devices().unwrap();
    let mut constraints = DisplayMediaStreamConstraints::new();
    constraints.video(&JsValue::from(true));
    constraints.audio(&JsValue::from(false));
    let gum = md.get_display_media_with_constraints(&constraints).unwrap();
    console::log!("permission granted");
    JsFuture::from(gum).await.map(MediaStream::from)
}

pub fn Screen(cx: Scope) -> Element {
    let isRecordingOver = use_state(&cx, || false);

    console::log!(*isRecordingOver);
    // when the element is mounted, bind the video element to the scope
    let fut = use_future(&cx, move || async move {
        let audio_stream = cam_stream().await.unwrap();
        let video_stream = display_stream().await.unwrap();
        let avm = AudioVideoMix(audio_stream, video_stream);
        avm
    });

    let k = match fut.value() {
        None => rsx!(h1{"loading"}),
        Some(ms) => {
            if *isRecordingOver {
                let tracks = ms.get_tracks();
                for t in tracks.iter() {
                    //console::log!(&t);
                    let mst = t.unchecked_into::<MediaStreamTrack>();
                    mst.stop();
                }
            }
            rsx!(Recorder {
                stream: ms.clone(),
                dispathEvent: isRecordingOver,
            })
        }
    };

    cx.render(rsx!(k))
}
