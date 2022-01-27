#![allow(non_snake_case)]

use dioxus::prelude::*;
use dioxus::router::{Route, Router};

use crate::cam::VideoTag;
use crate::home::Home;
use crate::screen::Screen;

pub fn RouteMap(cx: Scope) -> Element {
    cx.render(rsx! {
        Router {
            Route { to: "/", Home{} }
            Route { to: "/cam/", VideoTag{} }
            Route { to: "/screen/", Screen{}}
            Route { to: "", "Err 404 Route Not Found" }
        }
    })
}
