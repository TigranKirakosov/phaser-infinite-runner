export enum Events {
  SET_STATE,
  TAKE_BUFF,
  TAKE_DEBUFF,
  TAKE_DAMAGE,
}

export type Event<T> = {
  type: Events
  data?: T
}
