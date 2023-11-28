import cloneDeep from "lodash.clonedeep"
import {measure} from "./measure.mjs"
import {produce, setUseStrictShallowCopy} from "../dist/immer.mjs"

console.log("\n# large-obj - mutate large object\n")

const MAX = 50

const baseState = Object.fromEntries(
	Array(10000)
		.fill(0)
		.map((_, i) => [i, i])
)

const baseMap = new Map(
	Array(10000)
		.fill(0)
		.map((_, i) => [i, i])
)

measure("immer - with setUseStrictShallowCopy", () => {
	setUseStrictShallowCopy(true)

	for (let i = 0; i < MAX; i++) {
		produce(baseState, draft => {
			draft[5000]++
		})
	}
})

measure("immer - without setUseStrictShallowCopy", () => {
	setUseStrictShallowCopy(false)

	for (let i = 0; i < MAX; i++) {
		produce(baseState, draft => {
			draft[5000]++
		})
	}
})

measure(
	"native - JS Map mutation",
	() => ({draft: cloneDeep(baseMap)}),
	({draft}) => {
		for (let i = 0; i < MAX; i++) {
			const newVal = draft.get(5000) + 1
			draft.set(5000, newVal)
		}
	}
)
