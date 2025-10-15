let badusb = require("badusb");
let notify = require("notification");
let flipper = require("flipper");
let eventLoop = require("event_loop");
let gui = require("gui");
let dialog = require("gui/dialog");

let views = {
    dialog: dialog.makeWith({
        header: "BadUSB Linux POC",
        text: "Opens google chrome and loads a website in full screen",
        text: "Press OK to start",
        center: "Start",
    }),
};

badusb.setup({
    vid: 0x05AC,  // Apple's actual VID
    pid: 0x0250,  // Apple Keyboard PID
    mfrName: "Apple Inc.",
    prodName: "Magic Keyboard",
    layoutPath: "/ext/badusb/assets/layouts/en-US.kl"
});

eventLoop.subscribe(views.dialog.input, function (_sub, button, eventLoop, gui) {
    if (button !== "center")
        return;

    gui.viewDispatcher.sendTo("back");

    if (badusb.isConnected()) {
        notify.blink("green", "short");
        print("USB is connected");

       // Add code here
        badusb.press("ALT", "t");
        delay(250);
        badusb.println("google-chrome --new-window --incognito https://eyelockmyscreen.com && exit");
        delay(250);
        badusb.press("F11");

        notify.success();
    } else {
        print("USB not connected");
        notify.error();
    }

    // Optional, but allows to unlock usb interface to switch profile
    badusb.quit();

    eventLoop.stop();
}, eventLoop, gui);

eventLoop.subscribe(gui.viewDispatcher.navigation, function (_sub, _item, eventLoop) {
    eventLoop.stop();
}, eventLoop);

gui.viewDispatcher.switchTo(views.dialog);
eventLoop.run();
