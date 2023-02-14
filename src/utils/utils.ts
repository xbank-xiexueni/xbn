import random from 'lodash-es/random'
import range from 'lodash-es/range'
import sampleSize from 'lodash-es/sampleSize'

function generateList(l: number): Promise<Record<string, string>[]> {
  const res = range(l || 10).map((item) => ({
    ID: item.toString(),
    col1: sampleSize(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      random(2, 10),
    )
      ?.toString()
      .replace(/,/g, ''),
    col2: sampleSize(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      2,
    )
      ?.toString()
      .replace(/,/g, ''),
    col3: sampleSize(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      5,
    )
      ?.toString()
      .replace(/,/g, ''),
    col4: sampleSize(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      8,
    )
      ?.toString()
      .replace(/,/g, ''),
    col5: sampleSize(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      16,
    )
      ?.toString()
      .replace(/,/g, ''),
    col6: sampleSize(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      2,
    )
      ?.toString()
      .replace(/,/g, ''),
    col7: sampleSize(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      16,
    )
      ?.toString()
      .replace(/,/g, ''),
  }))
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(res)
    }, 1000)
  })
}

export { generateList }
