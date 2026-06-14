import { combineRgb } from '@companion-module/base'
import type ModuleInstance from './main.js'
import { INPUT_NAME_CHOICES } from './nec/constants.js'

export type FeedbacksSchema = {
	connected: { type: 'boolean'; options: Record<string, never> }
	power_on: { type: 'boolean'; options: Record<string, never> }
	input_active: { type: 'boolean'; options: { input: string } }
	picture_mute: { type: 'boolean'; options: Record<string, never> }
	sound_mute: { type: 'boolean'; options: Record<string, never> }
	onscreen_mute: { type: 'boolean'; options: Record<string, never> }
	freeze: { type: 'boolean'; options: Record<string, never> }
	shutter_closed: { type: 'boolean'; options: Record<string, never> }
	has_error: { type: 'boolean'; options: Record<string, never> }
}

const white = combineRgb(255, 255, 255)
const black = combineRgb(0, 0, 0)
const green = combineRgb(0, 153, 0)
const red = combineRgb(204, 0, 0)
const amber = combineRgb(204, 102, 0)

export function UpdateFeedbacks(self: ModuleInstance): void {
	self.setFeedbackDefinitions({
		power_on: {
			name: 'Power is On',
			type: 'boolean',
			defaultStyle: { bgcolor: green, color: white },
			options: [],
			callback: () => self.state.powered,
		},
		connected: {
			name: 'Projector is reachable',
			type: 'boolean',
			defaultStyle: { bgcolor: green, color: white },
			options: [],
			callback: () => self.state.reachable,
		},
		input_active: {
			name: 'Active input is',
			type: 'boolean',
			defaultStyle: { bgcolor: green, color: white },
			options: [
				{
					type: 'dropdown',
					id: 'input',
					label: 'Input',
					default: 'HDMI',
					choices: INPUT_NAME_CHOICES,
				},
			],
			callback: (fb) => self.state.inputName === fb.options.input,
		},
		picture_mute: {
			name: 'Picture mute is On',
			type: 'boolean',
			defaultStyle: { bgcolor: red, color: white },
			options: [],
			callback: () => self.state.pictureMute,
		},
		sound_mute: {
			name: 'Sound mute is On',
			type: 'boolean',
			defaultStyle: { bgcolor: red, color: white },
			options: [],
			callback: () => self.state.soundMute,
		},
		onscreen_mute: {
			name: 'On-screen mute is On',
			type: 'boolean',
			defaultStyle: { bgcolor: amber, color: white },
			options: [],
			callback: () => self.state.onscreenMute,
		},
		freeze: {
			name: 'Freeze is On',
			type: 'boolean',
			defaultStyle: { bgcolor: amber, color: black },
			options: [],
			callback: () => self.state.freeze,
		},
		shutter_closed: {
			name: 'Shutter is Closed',
			type: 'boolean',
			defaultStyle: { bgcolor: red, color: white },
			options: [],
			callback: () => self.state.shutter,
		},
		has_error: {
			name: 'Projector has an error',
			type: 'boolean',
			defaultStyle: { bgcolor: red, color: white },
			options: [],
			callback: () => self.state.hasError,
		},
	})
}
