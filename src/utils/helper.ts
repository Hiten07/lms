export function diff_minutes(current: Date, dt1: Date) {
  var diff = (current.getTime() - dt1.getTime()) / 1000;
  diff = diff / 60;
  return Math.abs(Math.round(diff));
}