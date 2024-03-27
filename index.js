/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {number} a
 * @param {number} b
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeInBetween = function(list1, a, b, list2) {
  let prev = list1,
    temp1 = list1,
    curr = list1;
  a--; // Adjust a to match zero-based indexing

  // Traverse list1 to find the node at position (a-1)
  while (temp1 && a-- > 0) {
    temp1 = temp1.next;
    prev = temp1;
  }

  temp1 = list1; // Reset temp1 to traverse list1 again

  // Traverse list1 to find the node at position (b+1)
  while (temp1 && b-- > 0) {
    temp1 = temp1.next;
    curr = temp1;
  }

  let temp2 = list2; // Initialize pointer to traverse list2

  // Traverse list2 to find the last node
  while (temp2.next !== null) {
    temp2 = temp2.next;
  }

  prev.next = list2; // Connect the node before position 'a' to the head of list2
  temp2.next = curr.next; // Connect the last node of list2 to the node after position 'b'

  return list1; // Return the head of list1
};

const list1 = [0, 1, 2, 3, 4, 5, 6];
const a = 2;
const b = 5;
const list2 = [1000000, 1000001, 1000002, 1000003, 1000004];
console.log(mergeInBetween(list1, a, b, list2));
