<template>
  <div class="multi-level-filter">
    <div class="filter-group">
      <el-button v-for="(item, index) in filters" :key="index" :class="{ active: selectedFilter === index }"
        @click="selectFilter(index)">
        {{ item.name }}
      </el-button>
    </div>

    <div class="filter-options" v-if="selectedFilter !== null">
      <div class="filter-item" v-for="option in filters[selectedFilter].options" :key="option.label">
        <span class="filter-label">{{ option.label }}:</span>
        <div class="filter-values">
          <el-button v-for="(value, valueIndex) in option.values" :key="valueIndex"
            :type="isSelected(option.label, value) ? 'primary' : ''" @click="toggleSelection(option.label, value)">
            {{ value.label }}({{ value.count }})
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedFilter: 0, // 默认选中第一个筛选项
      selectedOptions: {},
      filters: [
        {
          name: "专家",
          options: [
            {
              label: "h指数",
              values: [
                { label: ">=60", count: 2 },
                { label: "50-60", count: 4 },
                { label: "30-40", count: 1 },
                { label: "20-30", count: 3 },
                { label: "10-20", count: 494 },
                { label: "<10", count: 5000 },
              ],
            },
            {
              label: "性别",
              values: [
                { label: "男", count: 56 },
                { label: "女", count: 1 },
              ],
            },
            {
              label: "地区",
              values: [
                { label: "中国", count: 25 },
                { label: "日本", count: 3 },
                { label: "美国", count: 3 },
                { label: "台湾", count: 1 },
              ],
            },
            {
              label: "语言",
              values: [
                { label: "chinese", count: 111 },
                { label: "japanese", count: 12 },
              ],
            },
          ],
        },
        {
          name: "论文",
          options: [
            // 其他选项
          ],
        },
        {
          name: "专利",
          options: [
            // 其他选项
          ],
        },
      ],
    };
  },
  methods: {
    selectFilter(index) {
      console.log(index)
      this.selectedFilter = index;
    },
    toggleSelection(label, value) {
      const key = `${label}-${value.label}`;
      if (this.selectedOptions[key]) {
        delete this.selectedOptions[key];
      } else {
        this.$set(this.selectedOptions, key, value);
      }
    },
    isSelected(label, value) {
      const key = `${label}-${value.label}`;
      console.log(key)
      console.log(this.selectedOptions[key])
      return !!this.selectedOptions[key];
    },
  },
};
</script>

<style lang="scss" scoped>
.multi-level-filter {
  padding: 20px;
  background-image: linear-gradient(#dff3f9, #ffffff, #ffffff);
  border-radius: 15px;
  width: 1300px;
  margin: 0 auto 30px;
  justify-content: space-between;
  box-shadow: 0 0 5px 0 #a8a8a8;

  .el-button {
    background: #fff0;
    border: 0px;
    border-radius: 15px;
  }
}

.filter-group {
  margin-bottom: 20px;
}

.el-button.active {
  background-color: #409eff;
  color: #fff;
}

.filter-options {
  padding: 20px;
  border-radius: 10px;
}

.filter-item {
  margin-bottom: 15px;
}

.filter-label {
  font-weight: bold;
  margin-right: 10px;
}

.filter-values {
  display: inline-block;
}

.filter-values .el-button {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>