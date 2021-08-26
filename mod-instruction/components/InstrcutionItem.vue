<style lang='less' scoped>

.InstrcutionItem{
  .InstrcutionItemInfo{
    .InstrcutionItemInfoItem{
      padding: 2px 0;
      border-bottom: 1px #fff solid;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      .InstrcutionItemInfoItemLabel{
        width: 50px;
        flex: none;
      }
      .InstrcutionItemInfoItemContent{
        width: 100%;
        flex: auto;
        .InstrcutionItemInfoItemDataItem{
          margin-bottom: 4px;
          &:last-child{
            margin-bottom: 0px;
          }
        }
      }
      &:last-child{
        border-bottom: none;
      }
    }
  }
}

.desList{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  .desItem{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    .desItemTitle{
      margin-right: 4px;
    }
    .desItemContent{
      margin-right: 8px;
      padding-right: 8px;
      border-right: 2px #fff solid;
    }
    &:last-child {
      .desItemContent{
        border-right: none;
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
          <h4>名称</h4>
        </div>
        <div class="InstrcutionItemInfoItemContent">
          <p class="high">{{ data.prop }}</p>
        </div>
      </div>
      <div class="InstrcutionItemInfoItem">
        <div class="InstrcutionItemInfoItemLabel">
          <h4>属性</h4>
        </div>
        <div class="InstrcutionItemInfoItemContent">
          <div class="desList">
            <div class="desItem">
              <p class="desItemTitle">来源:</p>
              <p class="desItemContent">{{ data.from || 'self' }}</p>
            </div>
            <div class="desItem" v-if="checkShow(['build', 'data'])">
              <p class="desItemTitle">类型:</p>
              <p class="desItemContent">{{ data.type || '-' }}</p>
            </div>
            <div class="desItem" v-if="checkShow(['build', 'data'])">
              <p class="desItemTitle">默认值:</p>
              <p class="desItemContent">{{ data.default || '-' }}</p>
            </div>
            <div class="desItem" v-if="checkShow('build')">
              <p class="desItemTitle">必选:</p>
              <p class="desItemContent">{{ data.required ? '是' : '否' }}</p>
            </div>
          </div>
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
          <h4>{{ type == 'build' ? '目标' : '继承' }}</h4>
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
      <div class="InstrcutionItemInfoItem" v-if="checkShow('method') && data.args && data.args.length > 0" >
        <div class="InstrcutionItemInfoItemLabel">
          <h4>参数</h4>
        </div>
        <div class="InstrcutionItemInfoItemContent">
          <div class="InstrcutionItemInfoItemDataItem" v-for="(val, index) in data.args" :key="index">
            <slot name="default" :target="val" />
          </div>
        </div>
      </div>
      <div class="InstrcutionItemInfoItem" v-if="checkShow('method') && data.return" >
        <div class="InstrcutionItemInfoItemLabel">
          <h4>返回值</h4>
        </div>
        <div class="InstrcutionItemInfoItemContent">
          <p>{{ data.return }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _func from 'complex-func'
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
    }
  },
  mounted () {
    this.pageLoad()
  },
  methods: {
    checkShow(type) {
      let show = true
      if (type) {
        if (_func.getType(type) != 'array') {
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
