#![allow(non_snake_case)]

use crate::utils::Action;
use dioxus::prelude::*;

use crate::recorder::Recorder;

//use crate::utils::cam_stream;

use gloo::{console, utils};
use wasm_bindgen::*;
use wasm_bindgen_futures::JsFuture;
use web_sys::{HtmlMediaElement, MediaStream, MediaStreamConstraints};

async fn cam_stream() -> Result<MediaStream, JsValue> {
    let md = utils::window().navigator().media_devices().unwrap();
    let mut constraints = MediaStreamConstraints::new();
    constraints.video(&JsValue::from(true));
    constraints.audio(&JsValue::from(true));
    let gum = md.get_user_media_with_constraints(&constraints).unwrap();
    console::log!("Waiting for permission");
    JsFuture::from(gum).await.map(MediaStream::from)
}

pub fn VideoTag(cx: Scope) -> Element {
    let vtag = use_ref(&cx, || None);
    let isRecordingOver = use_ref(&cx, || false);
    let (_, set_action) = use_state(&cx, || Action::Idle);

    //console::log!(*isRecordingOver);
    // when the element is mounted, bind the video element to the scope
    let fut = use_future(&cx, move || {
        let vtag = vtag.clone();
        async move {
            let cam_video = cam_stream().await;
            let kms = match cam_video {
                Ok(ms) => {
                    let k = utils::document()
                        .get_element_by_id("my-video")
                        .unwrap()
                        .dyn_into::<HtmlMediaElement>()
                        .unwrap();

                    k.set_src_object(Some(&ms));
                    k.set_muted(true);

                    vtag.write().replace(k);
                    Ok(ms)
                }
                Err(e) => Err(e),
            };
            kms
        }
    });

    let k = match fut.value() {
        None => rsx!(h1{"Waiting for permission"}),
        Some(Ok(ms)) => {
            rsx!(Recorder {
                stream: ms,
                stream_screen: ms,
                source: "cam",
                set_action: set_action,
                isRecordingOver: isRecordingOver,
            })
        }
        Some(Err(_)) => {
            rsx!(p { "Access denied error" })
        }
    };

    let displayVideo = match *isRecordingOver.read() {
        true => rsx!(""),
        false => rsx!(video {
            id: "my-video",
            autoplay: "true" /* autoplay is very important */
        }),
    };

    cx.render(rsx! (
        k
        displayVideo
    ))
}
