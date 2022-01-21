#![allow(non_snake_case)]

use dioxus::prelude::*;
use dioxus::router::{Route, Router};

use crate::cam::VideoTag;
use crate::home::Home;
use crate::icons::{Icon, Icons};

pub fn RouteMap(cx: Scope) -> Element {
    let iconCam = Icons(cx, Icon::Camera);
    let iconRecord = Icons(cx, Icon::Record);
    cx.render(rsx! {
        Router {
            Route { to: "/", Home{} }
            Route { to: "/cam/", VideoTag{} }
            Route { to: "/users", span{style:"color:red;", &iconCam}}
            Route { to: "/blog", span{style:"color:green;", &iconRecord}}
            Route { to: "", "Err 404 Route Not Found" }
        }
    })
}
