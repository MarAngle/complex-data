<style lang='less' scoped>
.InstrcutionView{
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0 10px;
  border-radius: 4px;
  border: 1px #fff solid;
  .InstrcutionViewTarget{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    .InstrcutionViewTargetView{
      width: 100%;
      flex: auto;
    }
    .InstrcutionViewTargetMenu{
      width: 60px;
      text-align: center;
      flex: none;
    }
  }
}
</style>
<template>
  <div class="InstrcutionView">
    <InstrcutionItem :data="data" :type="type">
      <template slot="default" slot-scope="slotProps">
        <InstrcutionView :data="slotProps.target" :type="type" ></InstrcutionView>
      </template>
      <template slot="target" slot-scope="slotProps">
        <div class="InstrcutionViewTarget">
          <InstrcutionView class="InstrcutionViewTargetView" :data="slotProps.target" :type="type" :deep="deep + 1" v-show="showTarget"></InstrcutionView>
          <div class="InstrcutionViewTargetMenu" @click="showTarget = !showTarget" >
            <p>{{ showTarget ? '关闭' : '查看' }}</p>
          </div>
        </div>
      </template>
    </InstrcutionItem>
  </div>
</template>

<script>
import InstrcutionItem from './InstrcutionItem'
export default {
  name: `InstrcutionView`,
  components: {
    InstrcutionItem
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
    },
    deep: {
      type: Number,
      required: false,
      default: 1
    }
  },
  data () {
    return {
      showTarget: false
    }
  },
  mounted () {
    this.pageLoad()
  },
  methods: {
    pageLoad () {
    }
  }
}
</script>
