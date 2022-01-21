use dioxus::prelude::*;

use gloo::{console, utils};
use wasm_bindgen::*;
use wasm_bindgen_futures::JsFuture;
use web_sys::{window, HtmlMediaElement, HtmlVideoElement, MediaStream, MediaStreamConstraints};

fn main() {
    dioxus::web::launch(app);
}

async fn camStream() -> Result<MediaStream, JsValue> {
    let md = utils::window().navigator().media_devices().unwrap();
    let mut constraints = MediaStreamConstraints::new();
    constraints.video(&JsValue::from(true));
    constraints.audio(&JsValue::from(true));
    let gum = md.get_user_media_with_constraints(&constraints).unwrap();
    console::log!("permission granted");
    JsFuture::from(gum).await.map(MediaStream::from)
}

fn myvideo(cx: Scope) -> Element {
    let kvideo = use_ref(&cx, || None);

    cx.use_hook(|_| {
        let kvideo = kvideo.clone();
        cx.push_future(async move {
            let el = utils::document()
                .get_element_by_id("my-video")
                .unwrap()
                .dyn_into::<HtmlMediaElement>()
                .unwrap()
                .set_src_object(Some(cx.props.stream));

            kvideo.write().replace(el);
            //el.set_src_object(Some(&prop));
        });
    });

    cx.render(rsx! {
        video { id: "my-video" }
    })
}

fn cam(cx: Scope) -> Element {
    //let count = use_state(&cx, || "waiting");

    console::log!("Hai");
    let md = utils::window().navigator().media_devices().unwrap();
    let mut constraints = MediaStreamConstraints::new();
    constraints.video(&JsValue::from(true));
    constraints.audio(&JsValue::from(true));

    let gum = md.get_user_media_with_constraints(&constraints).unwrap();
    let fut = use_future(&cx, || {
        //let count = count.for_async();
        async move {
            console::log!("permission granted");
            let k = JsFuture::from(gum).await.map(MediaStream::from);
            //count.set("done");
            k
        }
    });

    cx.render(match fut.value() {
        None => rsx!(h2{"waiting..."}),
        Some(Ok(stream)) => {
            rsx!(h3{"hai...."})
        }
        Some(Err(_)) => rsx!(h2{"err..."}),
    })
}

fn app(cx: Scope) -> Element {
    let mut count = use_state(&cx, || 0);

    cx.render(rsx!(
        cam()
        header()
        h1 { "High-Five counter: {count}" }
        button {
            onclick: move |_| count += 1,
            "Up high!"
        }
        button {
            onclick: move |_| count -= 1,
            "Down low!"
        }
        button {
            "Show Camera"
        }
    ))
}

fn header(cx: Scope) -> Element {
    cx.render(rsx!(
        nav {
            ul {
                li{"kanna"}
                li{"hello"}
            }
        }
    ))
}
