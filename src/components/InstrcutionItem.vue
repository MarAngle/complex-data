<style lang='less' scoped>

.InstrcutionItem{
  h4,p{
    margin: 0;
    font-size: 14px;
    line-height: 24px;
    margin: 4px 0;
  }
  .InstrcutionItemInfo{
    .InstrcutionItemInfoItem{
      margin: 5px 0;
      border-bottom: 1px #fff solid;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      .InstrcutionItemInfoItemLabel{
        width: 60px;
        flex: none;
      }
      .InstrcutionItemInfoItemContent{
        width: 100%;
        flex: auto;
        .InstrcutionItemInfoItemDataItem{
          margin: 5px 0;
        }
      }
      &:last-child{
        border-bottom: none;
      }
    }
  }
}

</style>
<template>
  <div class="InstrcutionItem">
    <div class="InstrcutionItemInfo" >
      <div class="InstrcutionItemInfoItem">
        <div class="InstrcutionItemInfoItemLabel">
          <h4>属性</h4>
        </div>
        <div class="InstrcutionItemInfoItemContent">
          <p>{{ data.prop }}</p>
        </div>
      </div>
      <div class="InstrcutionItemInfoItem">
        <div class="InstrcutionItemInfoItemLabel">
          <h4>类型</h4>
        </div>
        <div class="InstrcutionItemInfoItemContent">
          <p>{{ data.type || '-' }}</p>
        </div>
      </div>
      <div class="InstrcutionItemInfoItem">
        <div class="InstrcutionItemInfoItemLabel">
          <h4>来源</h4>
        </div>
        <div class="InstrcutionItemInfoItemContent">
          <p>{{ data.from || '-' }}</p>
        </div>
      </div>
      <div class="InstrcutionItemInfoItem" v-if="checkShow('build')">
        <div class="InstrcutionItemInfoItemLabel">
          <h4>必选</h4>
        </div>
        <div class="InstrcutionItemInfoItemContent">
          <p>{{ data.required ? '是' : '否' }}</p>
        </div>
      </div>
      <div class="InstrcutionItemInfoItem">
        <div class="InstrcutionItemInfoItemLabel">
          <h4>描述</h4>
        </div>
        <div class="InstrcutionItemInfoItemContent">
          <div v-for="(val, index) in data.describe" :key="index">
            <p>{{ val }}</p>
          </div>
        </div>
      </div>
      <div class="InstrcutionItemInfoItem" v-if="data.class" >
        <div class="InstrcutionItemInfoItemLabel">
          <h4>TARGET</h4>
        </div>
        <div class="InstrcutionItemInfoItemContent">
          <div class="InstrcutionItemInfoItemDataItem">
            <slot name="target" :target="data.class" />
          </div>
        </div>
      </div>
      <div class="InstrcutionItemInfoItem" v-if="data.data" >
        <div class="InstrcutionItemInfoItemLabel">
          <h4>数据</h4>
        </div>
        <div class="InstrcutionItemInfoItemContent">
          <div class="InstrcutionItemInfoItemDataItem" v-for="(val, index) in data.data" :key="index">
            <slot name="default" :target="val" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InstrcutionView from './InstrcutionView'

export default {
  name: `InstrcutionItem`,
  components: {
    InstrcutionView
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: false,
      default: 'data'
    }
  },
  data () {
    return {
      list: ['data', 'build', 'method']
    }
  },
  mounted () {
    this.pageLoad()
  },
  methods: {
    checkShow(type) {
      let show = true
      if (type) {
        if (this._func.getType(type) != 'array') {
          type = [type]
        }
        show = type.indexOf(this.type) > -1
      }
      return show
    },
    pageLoad () {
    }
  }
}
</script>
