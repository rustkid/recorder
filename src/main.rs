mod cam;
mod home;
mod icons;
mod recorder;
mod router;

use dioxus::prelude::*;

use router::RouteMap;

fn main() {
    dioxus::web::launch(app);
}

fn app(cx: Scope) -> Element {
    cx.render(rsx! {RouteMap()})
}
