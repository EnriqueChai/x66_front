import author from "./modules/author"

const getters = {
  // 姓名
  authorName: state => state.authorInfo.authorInfo.author.authorName,
  // 头像
  authorPic: state => state.authorInfo.authorInfo.author.picture,
  // 职称
  authorPos: state => state.authorInfo.authorInfo.author.position,
  // Org
  authorOrg: state => state.authorInfo.authorInfo.author.authorOrg,
  // 个人简介
  authorBio: state => state.authorInfo.authorInfo.author.biography,
  // 教育背景
  authorAdu: state => state.authorInfo.authorInfo.author.education,
  // 词云
  authorTag: state => state.authorInfo.authorInfo.author.tags,
  // 主页
  authorHomepage: state => state.authorInfo.authorInfo.author.homepage,
  // 邮箱
  authorEmail: state => state.authorInfo.authorInfo.author.email,
  // citation
  authorCitation: state => state.authorInfo.authorInfo.author.ncitation,
  //  H-index
  authorHindex: state => state.authorInfo.authorInfo.author.hindex,
  // interests
  authorInterests: state => state.authorInfo.authorInfo.author.interests
}
export default getters
