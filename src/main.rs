mod cam;
mod home;
mod icons;
mod recorder;
mod router;
mod screen;
mod utils;

use dioxus::prelude::*;

use console_error_panic_hook;

use router::RouteMap;

fn main() {
    dioxus::web::launch(app);
}

fn app(cx: Scope) -> Element {
    console_error_panic_hook::set_once();
    cx.render(rsx! {RouteMap()})
}
