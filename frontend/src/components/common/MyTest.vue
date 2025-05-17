<!-- ÓÃÓÚ²âÊÔ -->
<template>
  <div
    @dblclick="rename(true, $event)"
    @click="dbDiff"
    :class="isEdit ? 'is-sedit' : ''"
    ref="reDom">
    <el-input
      @blur="rename(false, $event)"
      maxlength="40"
      @keyup.enter="rename(false, $event)"
      v-model="label"
      v-if="isEdit && !props.disabled"
      ref="inpRef" />
    <popover :list="modelValue" v-else></popover>
  </div>
</template>
<script>
export default {
  name: "MyTest",
  components: {
    popover: ElPopover,
  },
}
</script>
<script setup>
import { ref, nextTick} from "vue"
import { ElPopover } from "element-plus"
// import $ from 'jquery'
const props = defineProps({
  modelValue: String,
  successRename: Function,
  disabled: Boolean,
})
const emits = defineEmits(["update:modelValue", "edit", "singleClick"])
const isEdit = ref(false)
const label = ref(props.modelValue)
const inpRef = ref(null)
const reDom = ref()
let timeout = null
const rename = (edit, e) => {
  e.stopPropagation()
  e.preventDefault()
  clearTimeout(timeout)
  if (isEdit.value === edit) return
  isEdit.value = edit
  emits("edit", edit)
  nextTick(() => {
    if (isEdit.value) {
      inpRef.value.focus()
      label.value = props.modelValue
    } else {
      if (label.value && label.value !== props.modelValue) {
        emits("update:modelValue", label.value)
        props.successRename && props.successRename(label.value)
      }
    }
  })
}

const dbDiff = (e) => {
  e.stopPropagation()
  clearTimeout(timeout)
  if (isEdit.value) return
  timeout = setTimeout(function () {
    emits("singleClick", e)
    reDom.value.parentNode.click()
  }, 300)
}
</script>
<style lang="scss" scoped>
.is-edit {
  background-color: rgb(228, 215, 250);
}
</style>
