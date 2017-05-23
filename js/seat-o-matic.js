let SeatOMatic = function() {

  let s = {}

  function zeros(size) {
    let M = []
    for (let i = 0; i < size; i++) {
      M.push([])
      for (let j = 0; j < size; j++) {
        M[i].push(0)
      }
    }
    return M
  }

  s.seq = function(list,sum) {
    let M = zeros(list.length + 1)

    let best_sum = 1e+99
    let best = []

    for (let i = 1; i < list.length + 1; i++) {
      for (let j = i; j < list.length + 1; j++) {
        M[i][j] = list[j - 1] + M[i][j - 1]
        if (M[i][j] >= sum) {
          if (best.length == 0 || (j - i) < best[1] - best[0] || M[i][j] < best_sum) {
            best = [i-1, j-1]
            best_sum = M[i][j]
            break
          }
        }
      }
    } 

    return best
  } 

  return s
}

// let seater = SeatOMatic()

// let arr = [2,2,4,4,6]
// let size = 7
// console.log(seater.seq(arr, size))