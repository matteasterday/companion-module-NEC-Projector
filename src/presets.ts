import { combineRgb, type CompanionPresetDefinitions, type CompanionPresetSection } from '@companion-module/base'
import type ModuleInstance from './main.js'
import type { ModuleSchema } from './main.js'

const white = combineRgb(255, 255, 255)
const dark = combineRgb(0, 0, 0)
const green = combineRgb(0, 153, 0)
const red = combineRgb(204, 0, 0)
const amber = combineRgb(204, 102, 0)
const grey = combineRgb(40, 40, 40)

export function UpdatePresets(self: ModuleInstance): void {
	const v = (name: string): string => `$(${self.label}:${name})`
	const presets: CompanionPresetDefinitions<ModuleSchema> = {}

	// ---- Power ----
	presets['power_on'] = {
		type: 'simple',
		name: 'Power On',
		style: { text: 'POWER\\nON', size: '18', color: white, bgcolor: dark, show_topbar: false },
		steps: [{ down: [{ actionId: 'power', options: { mode: 'on' } }], up: [] }],
		feedbacks: [{ feedbackId: 'power_on', options: {}, style: { bgcolor: green, color: white } }],
	}
	presets['power_off'] = {
		type: 'simple',
		name: 'Power Off',
		style: { text: 'POWER\\nOFF', size: '18', color: white, bgcolor: dark, show_topbar: false },
		steps: [{ down: [{ actionId: 'power', options: { mode: 'off' } }], up: [] }],
		feedbacks: [{ feedbackId: 'power_on', options: {}, style: { bgcolor: red, color: white } }],
	}
	presets['power_toggle'] = {
		type: 'simple',
		name: 'Power Toggle (with state)',
		style: { text: `POWER\\n${v('power')}`, size: '18', color: white, bgcolor: grey, show_topbar: false },
		steps: [{ down: [{ actionId: 'power', options: { mode: 'toggle' } }], up: [] }],
		feedbacks: [{ feedbackId: 'power_on', options: {}, style: { bgcolor: green, color: white } }],
	}

	// ---- Inputs ----
	const inputPreset = (id: string, label: string, code: number, matchName: string): void => {
		presets[id] = {
			type: 'simple',
			name: `Input: ${label}`,
			style: { text: label.replace(/ /g, '\\n'), size: '18', color: white, bgcolor: dark, show_topbar: false },
			steps: [{ down: [{ actionId: 'input_select', options: { input: code, custom: '' } }], up: [] }],
			feedbacks: [
				{ feedbackId: 'input_active', options: { input: matchName }, style: { bgcolor: green, color: white } },
			],
		}
	}
	inputPreset('input_computer1', 'Computer 1', 0x01, 'Computer 1')
	inputPreset('input_computer2', 'Computer 2', 0x02, 'Computer 2')
	inputPreset('input_video', 'Video', 0x06, 'Video')
	inputPreset('input_hdmi_1a', 'HDMI (PA/PX/PH)', 0x1a, 'HDMI')
	inputPreset('input_hdmi_a1', 'HDMI (M/ME)', 0xa1, 'HDMI')
	inputPreset('input_displayport', 'DisplayPort', 0x1b, 'DisplayPort')

	// ---- Mute / Freeze ----
	const togglePreset = (
		id: string,
		label: string,
		actionId: 'picture_mute' | 'sound_mute' | 'onscreen_mute' | 'freeze',
		feedbackId: 'picture_mute' | 'sound_mute' | 'onscreen_mute' | 'freeze',
		color: number,
	): void => {
		presets[id] = {
			type: 'simple',
			name: label,
			style: { text: label.replace(/ /g, '\\n'), size: '18', color: white, bgcolor: dark, show_topbar: false },
			steps: [{ down: [{ actionId, options: { mode: 'toggle' } }], up: [] }],
			feedbacks: [{ feedbackId, options: {}, style: { bgcolor: color, color: white } }],
		}
	}
	togglePreset('picture_mute', 'Picture Mute', 'picture_mute', 'picture_mute', red)
	togglePreset('sound_mute', 'Sound Mute', 'sound_mute', 'sound_mute', red)
	togglePreset('onscreen_mute', 'OSD Mute', 'onscreen_mute', 'onscreen_mute', amber)
	togglePreset('freeze', 'Freeze', 'freeze', 'freeze', amber)

	presets['shutter'] = {
		type: 'simple',
		name: 'Shutter (lens mute)',
		style: { text: 'SHUTTER', size: '18', color: white, bgcolor: dark, show_topbar: false },
		steps: [{ down: [{ actionId: 'shutter', options: { mode: 'toggle' } }], up: [] }],
		feedbacks: [{ feedbackId: 'shutter_closed', options: {}, style: { bgcolor: red, color: white } }],
	}

	// ---- Volume ----
	presets['volume_up'] = {
		type: 'simple',
		name: 'Volume +',
		style: { text: 'VOL\\n+', size: '24', color: white, bgcolor: dark, show_topbar: false },
		steps: [{ down: [{ actionId: 'volume_adjust', options: { adjustType: 'relative', value: 1 } }], up: [] }],
		feedbacks: [],
	}
	presets['volume_down'] = {
		type: 'simple',
		name: 'Volume −',
		style: { text: 'VOL\\n−', size: '24', color: white, bgcolor: dark, show_topbar: false },
		steps: [{ down: [{ actionId: 'volume_adjust', options: { adjustType: 'relative', value: -1 } }], up: [] }],
		feedbacks: [],
	}

	// ---- Status displays ----
	presets['status_input'] = {
		type: 'simple',
		name: 'Status: Active input',
		style: { text: `IN\\n${v('input')}`, size: '14', color: white, bgcolor: grey, show_topbar: false },
		steps: [],
		feedbacks: [],
	}
	presets['status_lamp'] = {
		type: 'simple',
		name: 'Status: Lamp remaining',
		style: { text: `LAMP\\n${v('lamp_remaining')}`, size: '14', color: white, bgcolor: grey, show_topbar: false },
		steps: [],
		feedbacks: [],
	}
	presets['status_filter'] = {
		type: 'simple',
		name: 'Status: Filter hours',
		style: { text: `FILTER\\n${v('filter_hours')}h`, size: '14', color: white, bgcolor: grey, show_topbar: false },
		steps: [],
		feedbacks: [],
	}
	presets['status_errors'] = {
		type: 'simple',
		name: 'Status: Errors',
		style: { text: `ERR\\n${v('error_count')}`, size: '14', color: white, bgcolor: grey, show_topbar: false },
		steps: [],
		feedbacks: [{ feedbackId: 'has_error', options: {}, style: { bgcolor: red, color: white } }],
	}

	const structure: CompanionPresetSection[] = [
		{
			id: 'power',
			name: 'Power',
			definitions: [
				{ id: 'power_grp', name: 'Power', type: 'simple', presets: ['power_on', 'power_off', 'power_toggle'] },
			],
		},
		{
			id: 'inputs',
			name: 'Inputs',
			definitions: [
				{
					id: 'inputs_grp',
					name: 'Inputs',
					type: 'simple',
					presets: [
						'input_computer1',
						'input_computer2',
						'input_video',
						'input_hdmi_1a',
						'input_hdmi_a1',
						'input_displayport',
					],
				},
			],
		},
		{
			id: 'mutes',
			name: 'Mute / Freeze',
			definitions: [
				{
					id: 'mutes_grp',
					name: 'Mute / Freeze',
					type: 'simple',
					presets: ['picture_mute', 'sound_mute', 'onscreen_mute', 'freeze', 'shutter'],
				},
			],
		},
		{
			id: 'volume',
			name: 'Volume',
			definitions: [{ id: 'volume_grp', name: 'Volume', type: 'simple', presets: ['volume_up', 'volume_down'] }],
		},
		{
			id: 'status',
			name: 'Status',
			definitions: [
				{
					id: 'status_grp',
					name: 'Status',
					type: 'simple',
					presets: ['status_input', 'status_lamp', 'status_filter', 'status_errors'],
				},
			],
		},
	]

	self.setPresetDefinitions(structure, presets)
}
