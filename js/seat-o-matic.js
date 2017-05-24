let SeatOMatic = function(nodes, edges) {

  let s = {}
  let waits = []
  let queue = []

  s.step = function() {
    waits = tick(waits, 1)
    let seated = []
    for (let i = 0; i < queue.length; i++) {
      let seating = find_seating(queue[i])
      if (seating.length > 0) {
        let time = Math.floor((2.387 * queue[i] + 50.18) / 10)
        each(seating, (s) => {
          waits[s] = time
        })
        seated.push(i)
      }
    }

    queue = pullAt(queue, seated.sort((a,b) => {
      return b - a
    }))
  }

  s.addQueue = function(v) {
    queue.push(v)
  }

  s.waits = function() {
    return waits
  }

  s.queue = function() {
    return queue
  }

  function seq(size,group) {
    if (size <= 0) {
      return { size: size, group: group }
    } 
    let min_g = { size: size, group: group }
    let n = group[group.length - 1]
    
    for (let e = 0; e < edges[n].length; e++) {
      let _e = edges[n][e]
      if (group.indexOf(_e) < 0 && !waits[_e]) {
        let diff = size - nodes[_e]
        if (diff >= -2 && diff < min_g.size) {
          group.push(_e)
          min_g = seq(diff,copy(group))
          group.pop()
        }
      }
    } 
    return min_g
  } 

   function find_seating(size) {
    let seqs = []
    for (let i = 0; i < nodes.length; i++) {
      if (!waits[i]) {
        let diff = size - nodes[i]
        seqs.push(seq(diff, [i]))
      }
    }

    let avail = seqs.filter((seq) => {
      return seq.size <= 0
    })

    if (avail.length > 0) {
      return min(avail, (s) => {
        return s.group.length
      }).group
    }
    return []
  }

  function pullAt(list, indexes) {
    each(indexes, (index) => {
      list.splice(index,1)
    })
    return list
  }

  function tick(list, by) {
    return map(list, (item) => {
      return max([0, item - by], (i) => i)
    })
  }

  function min(list, fn) {
    let min = 1e+99
    let min_i = -1
    for (let i = 0; i < list.length; i++) {
      let val = fn(list[i])
      if (val < min) {
        min = val
        min_i = i
      }
    }
    return list[min_i]
  }

  function max(list, fn) {
    let max = -1e+99
    let max_i = -1
    for (let i = 0; i < list.length; i++) {
      let val = fn(list[i])
      if (val > max) {
        max = val
        max_i = i
      }
    }
    return list[max_i]
  }

  function map(list, fn) {
    for (let i = 0; i < list.length; i++) {
      list[i] = fn(list[i])
    }
    return list
  }

  function each(obj, fn) {
    let keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      fn(obj[keys[i]], keys[i])
    }
  }

  function copy(obj) {
    var c;
    if (obj ===  null || typeof obj !== 'object') return obj

    if (obj instanceof Object) {
      c = {}
      each(obj, (value, key) => {
        c[key] = copy(obj[key]);
      })
    } 

    if (obj instanceof Array) {
      c = []
      each(obj, (value, index) => {
        c[index] = copy(obj[index])
      })
    }

    return c;
  }

  return s
}

/**** EXAMPLE ******/
// if you have node installed just run 'node seat-o-matic.js'

// // UNCOMMENT
// let nodes = [2,2,4,4,6] // tables
// let edges = [ // index is table, [] at index is possible other tables to group with
//   [1],        // table 0 can be moved with table 1
//   [0,2,3,4],  // table 1 can be moved with tables 0,2,3,4
//   [4],        // table 2 can be moved with table 4
//   [4],        // table 3 can be moved with table 4
//   [],         // table 4 cant be moved
// ]

// let seater = SeatOMatic(nodes, edges) // Make a seater object with tables and groupings
// seater.addQueue(7)                    // add party of 7 to queue
// seater.addQueue(3)                    // add party of 3 to queue
// console.log("Wait times:", seater.waits())
// console.log("Queue:", seater.queue())
// seater.step()                         // step and seat anyone who can be seated
// console.log("Wait times:", seater.waits())
// console.log("Queue:", seater.queue())
// seater.addQueue(2)                    // add party of 2 to queue
// seater.addQueue(4)                    // add party of 4 to queue
// console.log("Wait times:", seater.waits())
// console.log("Queue:", seater.queue())
// seater.step()                         // step and seat anyone who can be seated
// console.log("Wait times:", seater.waits())
// console.log("Queue:", seater.queue())