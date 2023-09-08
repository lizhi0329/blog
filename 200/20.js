// const str = '[{()()}]('

const str = '{)}'

// const str = "()[]{}"

function check(str) {
  if (str.length % 2 !== 0) {
    return false
  }
  const charArr = []
  // let res = true
  for (let char of str) {
    if (['[', '{', '('].includes(char)) {
      charArr.push(char)
    } else {
      if (char === ']' && charArr.pop() !== '[') {
        // res = false
        return false
      } else if (char === '}' && charArr.pop() !== '{') {
        // res = false
        return false
      } else if (char === ')' && charArr.pop() !== '(') {
        // res = false
        return false
      }
    }
  }
  if (charArr.length) {
    return false
  }
  return true
}

check(str)
console.log('check(str): ', check(str))
