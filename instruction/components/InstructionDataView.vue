<style lang='less' scoped>

.selectList{
  width: 100%;
  .selectItem{
    width: calc(50% - 10px);
    margin: 0 5px;
  }
  margin-bottom: 10px;
}

</style>
<template>
  <div class="mainpage" >
    <div>
      <p>说明:请勿在正式环境中引用</p>
    </div>
    <div class="selectList">
      <a-select class="selectItem" :value="select.current.target" @change="onTargetChange" placeholder="请选择数据" >
        <a-select-option v-for="val in select.dataList" :key="val.prop" :value="val.prop">{{ val.prop }}</a-select-option>
      </a-select>
      <a-select class="selectItem" :value="select.current.type" @change="onTypeChange" placeholder="请选择类型" >
        <a-select-option v-for="val in select.type" :key="val.value" :value="val.value">{{ val.label }}</a-select-option>
      </a-select>
    </div>
    <InstrcutionView v-if="maindata" :data="maindata" :type="select.current.type" />
  </div>
</template>

<script>
import instructionData from '../index'
import InstrcutionView from './InstrcutionView'

let dataList = []
for (let n in instructionData) {
  dataList.push({
    prop: n
  })
}
export default {
  name: `InstructionDataView`,
  components: {
    InstrcutionView
  },
  data () {
    return {
      maindata: null,
      select: {
        dataList: dataList,
        type: [
          {
            value: 'build',
            label: '传参'
          },
          {
            value: 'data',
            label: '数据结构'
          },
          {
            value: 'method',
            label: '方法'
          }
        ],
        current: {
          target: undefined,
          type: undefined
        }
      }
    }
  },
  mounted () {
    this.pageLoad()
  },
  methods: {
    onTargetChange(target) {
      this.select.current.target = target
      if (target) {
        this.buildMaindata()
      }
    },
    onTypeChange(type) {
      this.select.current.type = type
      if (type) {
        this.buildMaindata()
      }
    },
    buildMaindata() {
      let target = this.select.current.target
      let type = this.select.current.type
      let maindata = null
      if (target && type && instructionData[target]) {
        maindata = instructionData[target].getInstrcution(type)
        console.log(maindata)
      }
      this.$set(this, 'maindata', maindata)
    },
    pageLoad () {
    }
  }
}
</script>
