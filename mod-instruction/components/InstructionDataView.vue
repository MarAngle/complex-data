<style lang='less' scoped>
.InstructionDataView{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .InstructionDataViewHead{
    flex: none;
  }
  .InstructionDataViewContent{
    flex: auto;
    height: 100%;
    overflow: auto;
  }
}
.InstructionDataViewSelectArea{
  width: 100%;
  display: flex;
  flex-direction: row;
  .InstructionDataViewSelect{
    width: calc(50% - 10px);
    margin: 0 5px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    padding: 0 24px 0 11px;
    position: relative;
    background-color: #fff;
    .InstructionDataViewSelectContent{
      margin: 0;
      line-height: 30px;
    }
    .InstructionDataViewSelectOption{
      position: absolute;
      top: calc(100% + 10px);
      left: 0px;
      right: 0px;
      background-color: #fff;
      max-height: 250px;
      padding: 4px 0;
      overflow: auto;
      box-shadow: 0 0 4px #ccc;
      border-radius: 2px;
      .InstructionDataViewSelectOptionItem{
        line-height: 32px;
        padding: 0 0 0 11px;
        cursor: pointer;
        &:hover{
          background-color: #e6f7ff;
        }
      }
    }
  }
  margin-bottom: 10px;
}

</style>
<template>
  <div class="InstructionDataView" >
    <div class="InstructionDataViewHead">
      <div class="InstructionDataViewSelectArea">
        <div class="InstructionDataViewSelect" >
          <p class="InstructionDataViewSelectContent" @click="changeSelectShow('target')">{{ showSelectCurrent('target', '请选择数据') }}</p>
          <div class="InstructionDataViewSelectOption" v-show="select.show.target">
            <div class="InstructionDataViewSelectOptionItem" v-for="val in select.list.target" :key="val.value" :value="val.value" @click="onSelectChange('target', val.value)">{{ val.label }}</div>
          </div>
        </div>
        <div class="InstructionDataViewSelect" >
          <p class="InstructionDataViewSelectContent" @click="changeSelectShow('type')">{{ showSelectCurrent('type', '请选择类型') }}</p>
          <div class="InstructionDataViewSelectOption" v-show="select.show.type">
            <div class="InstructionDataViewSelectOptionItem" v-for="val in select.list.type" :key="val.value" :value="val.value" @click="onSelectChange('type', val.value)">{{ val.label }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="InstructionDataViewContent">
      <InstrcutionView v-if="maindata" :data="maindata" :type="select.current.type" />
    </div>
  </div>
</template>

<script>
import instructionData from '../data'
import InstrcutionView from './InstrcutionView'

let dataList = []
for (let n in instructionData) {
  dataList.push({
    value: n,
    label: n
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
        show: {
          target: false,
          type: false
        },
        current: {
          target: undefined,
          type: 'build'
        },
        list: {
          target: dataList,
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
          ]
        }
      }
    }
  },
  mounted () {
    this.pageLoad()
  },
  methods: {
    showSelectCurrent(prop, noContent) {
      let value = this.select.current[prop]
      if (!value) {
        return noContent
      } else {
        let label
        for (let i = 0; i < this.select.list[prop].length; i++) {
          const item = this.select.list[prop][i]
          if (item.value === value) {
            label = item.label
            break
          }
        }
        return label
      }
    },
    changeSelectShow(prop) {
      this.setSelectShow(prop, !this.select.show[prop])
    },
    setSelectShow(prop, data) {
      this.select.show[prop] = data
    },
    onSelectChange(prop, data) {
      this.select.current[prop] = data
      if (data) {
        this.buildMaindata()
      }
      this.setSelectShow(prop, false)
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
