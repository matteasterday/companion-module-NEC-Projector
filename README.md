# companion-module-nec-projector

Control and monitor **NEC / Sharp NEC projectors** from [Bitfocus Companion](https://bitfocus.io/companion) over their built‑in HTTP control interface.

This module speaks the NEC "Projector Control Command" binary protocol through the projector's web CGI (`IsapiExtPj.dll`) — the same protocol used over RS‑232C and TCP port 7142, but tunnelled over plain HTTP, so no extra hardware or open TCP socket is required. It exposes the full command set as actions and polls the projector for live feedback variables.

See [HELP.md](./companion/HELP.md) for in‑app help and [LICENSE](./LICENSE).

## Features

**Actions**

- Power on / off / toggle
- Input / source select (named inputs + custom hex code for any model)
- Picture, sound and on‑screen (OSD) mute — on / off / toggle
- Freeze on / off / toggle
- Shutter / lens mute (open / close / toggle)
- Picture adjust (brightness, contrast, color, hue, sharpness — absolute or relative)
- Volume adjust (absolute or relative)
- Aspect ratio
- Eco / Lamp / Light mode
- Remote‑control key emulation (Menu, arrows, Enter, Source, Auto, Magnify, …)
- Lens control (zoom / focus / shift drive, move‑to‑value, lens memory, reference lens memory, profile)
- Audio select
- Edge blending on / off
- PIP / Picture‑by‑Picture
- Set LAN projector name
- Send raw command (advanced)

**Feedbacks** (boolean, with default styles)

- Power is on · Projector reachable · Active input is … · Picture / Sound / OSD mute on · Freeze on · Shutter closed · Projector has an error

**Variables** (polled)

- `connection`, `model`, `serial`, `mac`
- `power`, `operation_status`, `content`
- `input`, `input_code`
- `picture_mute`, `sound_mute`, `onscreen_mute`, `freeze`, `shutter`
- `lamp_remaining`, `lamp_hours`, `filter_hours`
- `eco_mode`, `error_count`, `errors`
- `sync_h`, `sync_v`

**Presets** for power, inputs, mutes/freeze/shutter, volume and status displays.

## Configuration

| Field                     | Description                                                                             |
| ------------------------- | --------------------------------------------------------------------------------------- |
| Projector IP / hostname   | Address of the projector on the network                                                 |
| HTTP port                 | Default `80`                                                                            |
| HTTP user name / password | Only required if the projector has an HTTP control password set (leave blank otherwise) |
| Poll projector for status | Enables periodic polling for feedback/variables                                         |
| Poll interval (seconds)   | How often to poll (default `5`)                                                         |

### HTTP password protection

If the projector's web server has a password configured, enter the user name and password in the connection settings. The module performs NEC's challenge‑response logon automatically (`?A=Cookie` → `?A=Rand` → `md5(nonce + password)` → `?A=Logon`) and re‑authenticates if the session expires. The projector limits passwords to 10 characters.

## Compatibility

This module works with NEC / Sharp NEC projectors that have a wired (or wireless) LAN connection and the classic **"Projector LAN Control"** web interface (`IsapiExtPj.dll`). That covers essentially the entire NEC **NP** projector line from ~2014–2020, including:

- **NP4100 / NP4100W**
- **M series** — NP‑M230X/260X/260W/271W/282X/283X/300W/300X/302W/311X/322X/323W/332XS/333XS/350X/352WS/353WS/361X/362W/363X/402W/403W/403X/420X …
- **ME series** — NP‑ME270X/301W/301X/331W/360X/361X/401W/401X …
- **P / PE series** — NP‑P350W/P420X/P451W/P501X/P502H/P525UL/P554U/P603X/P605UL, NP‑PE401H/PE501X/PE523X …
- **PA series** — NP‑PA500U/PA550W/PA600X/PA621U/PA622U/PA653UL/PA703W/PA722X/PA803UL/PA853W/PA903X/PA1004UL …
- **PH series** — NP‑PH1000U/PH1202HL/PH1400U/PH2601QL/PH3501QL …
- **PX series** — NP‑PX602UL/PX700W/PX750U/PX800X/PX803UL/PX1004UL/PX1005QL/PX2000UL …
- **U / UM series** — NP‑U300X/U310W/U321H, NP‑UM280X/UM301W/UM330W/UM351W/UM361X …
- **V / VE series** — NP‑V260X/V300X/V302H/V311X/V332W, NP‑VE280/VE281/VE303 …

> The authoritative model list is in NEC's _Projector Control Command Reference Manual_ and its _Appendixes_.

### Compatibility notes

- **Command support varies by model.** Unsupported commands (e.g. lens/shutter on models without a powered lens, or cover status on some models) simply return a NACK and are ignored — they will not break the connection.
- **Input / aspect / eco codes vary by model family.** For example HDMI 1 is `1Ah` on older PA/PX/PH but `A1h` on M/ME and newer PA models. The named dropdowns cover the common cases; every code‑based action also has a **Custom (hex)** option so any model is supported. The active‑input readback is decoded automatically.
- **Powering on from standby over LAN** requires the projector's _Standby Mode_ to allow network commands (e.g. _Network Standby_ / _Normal_). In a deep power‑saving standby some models will not respond until woken by other means.
- Newer Sharp/NEC laser models with a redesigned web UI may not expose `IsapiExtPj.dll`; this module targets the classic interface.

Tested against an **NEC NP‑PA550W**.

## Development

`yarn build` compiles the module (output in `dist/`). `yarn dev` runs the TypeScript compiler in watch mode. `yarn lint` checks formatting and lint rules.
