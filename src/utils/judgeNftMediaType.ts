enum NFT_MEDIA_TYPE {
  HTML_MEDIA = 'HTML',
  VIDEO_MEDIA = 'VIDEO',
  IMAGE_MEDIA = 'IMAGE',
}

const judgeNftMediaType = (animation_url: string) => {
  const lowercaseAnimationUrl = animation_url.toLowerCase()
  if (
    animation_url &&
    /\.(gif|jpg|jpeg|png|bmp|dib|rle|webp)$/.test(lowercaseAnimationUrl)
  ) {
    if (lowercaseAnimationUrl.includes('.html')) {
      return NFT_MEDIA_TYPE.HTML_MEDIA
    } else {
      return NFT_MEDIA_TYPE.VIDEO_MEDIA
    }
  }
  return NFT_MEDIA_TYPE.IMAGE_MEDIA
}

export { judgeNftMediaType, NFT_MEDIA_TYPE }
