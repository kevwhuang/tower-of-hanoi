const assert = require('chai').assert;

// =================================================================================================

let len1 = len2 = len3 = 0;
let rod1Disks = [];
let rod2Disks = [];
let rod3Disks = [];
let win = [1, 2, 3, 4, 5];

const lengths = () => {
  len1 = rod1Disks.length;
  len2 = rod2Disks.length;
  len3 = rod3Disks.length;
}

const move12 = () => {
  lengths();

  if (rod1Disks.length !== 0 && (rod1Disks[len1 - 1] > rod2Disks[len2 - 1] || len2 === 0)) {
    rod2Disks.push(rod1Disks.pop());
    return rod2Disks;
  } else {
    return false;
  }
}

const move13 = () => {
  lengths();

  if (rod1Disks.length !== 0 && (rod1Disks[len1 - 1] > rod3Disks[len3 - 1] || len3 === 0)) {
    rod3Disks.push(rod1Disks.pop());
    return rod3Disks;
  } else {
    return false;
  }
}

const move21 = () => {
  lengths();

  if (rod2Disks.length !== 0 && (rod2Disks[len2 - 1] > rod1Disks[len1 - 1] || len1 === 0)) {
    rod1Disks.push(rod2Disks.pop());
    return rod1Disks;
  } else {
    return false;
  }
}

const move23 = () => {
  lengths();

  if (rod2Disks.length !== 0 && (rod2Disks[len2 - 1] > rod3Disks[len3 - 1] || len3 === 0)) {
    rod3Disks.push(rod2Disks.pop());
    return rod3Disks;
  } else {
    return false;
  }
}

const move31 = () => {
  lengths();

  if (rod3Disks.length !== 0 && (rod3Disks[len3 - 1] > rod1Disks[len1 - 1] || len1 === 0)) {
    rod1Disks.push(rod3Disks.pop());
    return rod1Disks;
  } else {
    return false;
  }
}

const move32 = () => {
  lengths();

  if (rod3Disks.length !== 0 && (rod3Disks[len3 - 1] > rod2Disks[len2 - 1] || len2 === 0)) {
    rod2Disks.push(rod3Disks.pop());
    return rod2Disks;
  } else {
    return false;
  }
}

const checkWin = () => {
  if (win.join() === rod3Disks.join()) {
    return true;
  } else {
    return false;
  }
}

// =================================================================================================

describe('Legal Moves', function () {
  it('Move disk from rod 1 to rod 2', function () {
    rod1Disks = [2, 3];
    rod2Disks = [1];
    rod3Disks = [];
    assert.deepEqual(move12(), [1, 3]);
  });

  it('Move disk from rod 1 to rod 3', function () {
    rod1Disks = [2, 3];
    rod2Disks = [];
    rod3Disks = [1];
    assert.deepEqual(move13(), [1, 3]);
  });

  it('Move disk from rod 2 to rod 1', function () {
    rod1Disks = [1];
    rod2Disks = [2, 3];
    rod3Disks = [];
    assert.deepEqual(move21(), [1, 3]);
  });

  it('Move disk from rod 2 to rod 3', function () {
    rod1Disks = [];
    rod2Disks = [2, 3];
    rod3Disks = [1];
    assert.deepEqual(move23(), [1, 3]);
  });

  it('Move disk from rod 3 to rod 1', function () {
    rod1Disks = [1];
    rod2Disks = [];
    rod3Disks = [2, 3];
    assert.deepEqual(move31(), [1, 3]);
  });

  it('Move disk from rod 3 to rod 2', function () {
    rod1Disks = [];
    rod2Disks = [1];
    rod3Disks = [2, 3];
    assert.deepEqual(move32(), [1, 3]);
  });
});

describe('Illegal Moves', function () {
  it('Move disk from rod 1 to rod 2', function () {
    rod1Disks = [2, 3];
    rod2Disks = [4];
    rod3Disks = [];
    assert.deepEqual(move12(), false);
  });

  it('Move disk from rod 1 to rod 3', function () {
    rod1Disks = [2, 3];
    rod2Disks = [];
    rod3Disks = [4];
    assert.deepEqual(move13(), false);
  });

  it('Move disk from rod 2 to rod 1', function () {
    rod1Disks = [4];
    rod2Disks = [2, 3];
    rod3Disks = [];
    assert.deepEqual(move21(), false);
  });

  it('Move disk from rod 2 to rod 3', function () {
    rod1Disks = [];
    rod2Disks = [2, 3];
    rod3Disks = [4];
    assert.deepEqual(move23(), false);
  });

  it('Move disk from rod 3 to rod 1', function () {
    rod1Disks = [4];
    rod2Disks = [];
    rod3Disks = [2, 3];
    assert.deepEqual(move31(), false);
  });

  it('Move disk from rod 3 to rod 2', function () {
    rod1Disks = [];
    rod2Disks = [4];
    rod3Disks = [2, 3];
    assert.deepEqual(move32(), false);
  });
});

describe('Check for win', function () {
  it('Disks only on rod 1', function () {
    rod1Disks = [1, 2, 3, 4, 5];
    rod2Disks = [];
    rod3Disks = [];
    assert.equal(checkWin(), false);
  });

  it('Disks only on rod 2', function () {
    rod1Disks = [];
    rod2Disks = [1, 2, 3, 4, 5];
    rod3Disks = [];
    assert.equal(checkWin(), false);
  });

  it('Disks only on rod 3', function () {
    rod1Disks = [];
    rod2Disks = [];
    rod3Disks = [1, 2, 3, 4, 5];
    assert.equal(checkWin(), true);
  });
});
