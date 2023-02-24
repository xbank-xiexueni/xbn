/**
 * 下载图片并重命名
 * download('https://www.baidu.com/img/baidu_resultlogo@2.png', 'ab.png')
 */

/**
 * 获取 blob
 * @param  {String} url 目标文件地址
 * @return {cb}
 */
const getBlob = (url: string, cb: (arg: any) => void) => {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = 'blob'
  xhr.onload = function () {
    if (xhr.status === 200) {
      cb(xhr.response)
    }
  }
  xhr.send()
}

/**
 * 保存
 * @param  {Blob} blob
 * @param  {String} filename 想要保存的文件名称
 */
const saveAs = (blob: Blob, filename: string) => {
  const link = document.createElement('a')
  const body = document.querySelector('body')

  link.href = window.URL.createObjectURL(blob)
  link.download = filename
  if (!body) return

  // fix Firefox
  link.style.display = 'none'
  body.appendChild(link)

  link.click()
  body.removeChild(link)

  window.URL.revokeObjectURL(link.href)
}

/**
 * 下载
 * @param  {String} url 目标文件地址
 * @param  {String} filename 想要保存的文件名称
 */
const downloadRemoteImg = (url: string, filename: string) => {
  getBlob(url, function (blob: Blob) {
    saveAs(blob, filename)
  })
}
export default downloadRemoteImg
