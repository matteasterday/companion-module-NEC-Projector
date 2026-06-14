## NEC / Sharp NEC Projector

Control and monitor NEC / Sharp NEC projectors over HTTP using the projector's built‑in
`IsapiExtPj.dll` control interface (the "Projector LAN Control" web page). No extra hardware
or RS‑232 cabling is required — only a network connection to the projector.

### Setup

1. Connect the projector to your network and note its IP address.
2. Add this connection and enter the **IP address**. The **HTTP port** is normally `80`.
3. If the projector's web server is password protected, enter the **HTTP user name** and
   **password**. Otherwise leave them blank.
4. Leave **polling** enabled so feedbacks and variables stay up to date.

### Powering on from standby

To turn the projector **on** over the network, its _Standby Mode_ must be set to a mode that
accepts LAN commands (typically **Network Standby** or **Normal**). In a deep power‑saving
standby the projector may not respond to a power‑on command.

### Inputs, aspect and eco codes

NEC uses **different numeric codes per projector family** for inputs, aspect ratios and eco
modes. The dropdowns list the common values; if your model uses a different code, choose
**Custom (enter hex code below)** and type the hex value (e.g. `1A`). Common input codes:

| Input            | Code                           | Notes                   |
| ---------------- | ------------------------------ | ----------------------- |
| Computer 1 / RGB | `01`                           |                         |
| Computer 2       | `02`                           |                         |
| Video            | `06`                           |                         |
| S‑Video          | `0B`                           |                         |
| HDMI 1           | `1A`                           | older PA / PX / PH / PE |
| HDMI 1           | `A1`                           | M / ME / newer PA       |
| DisplayPort      | `1B` (older PA) / `A6` (newer) |                         |
| Viewer / USB‑A   | `1F`                           |                         |
| LAN / Network    | `20`                           |                         |
| HDBaseT          | `BF`                           |                         |
| SDI 1–4          | `C4`–`C7`                      |                         |

The **active input** is decoded automatically and shown in the `input` variable.

### Feedback & variables

With polling enabled the module reads power state, active input, mute/freeze status, lamp life
and hours, filter hours, eco mode, errors and sync frequency. Use the boolean **feedbacks** to
colour buttons (e.g. green when on, red when muted) and the **variables** (e.g.
`$(NEC:lamp_remaining)`, `$(NEC:input)`) in button text.

### Troubleshooting

- **Connection failure** – check the IP/port and that the projector's HTTP server / LAN control
  is enabled. Try opening `http://<projector-ip>/` in a browser.
- **A command does nothing** – not every command is supported on every model; unsupported
  commands are ignored. Some commands (mutes, input switch, lens) only work while the projector
  is powered on.
- **Wrong input is switched** – your model may use a different input code; use the **Custom
  (hex)** option (see the table above, or your model's command reference).
