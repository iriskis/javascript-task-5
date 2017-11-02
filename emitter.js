'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let events = {};

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            console.info(event, context, handler);
            if (!(event in events)) {
                events[event] = [];
            }
            events[event].push({ context, handler });

            return this;

        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            console.info(event, context);
            let eventsForUnfollow = Object.keys(events).filter(ev => ev.startsWith(`${event}.`));
            eventsForUnfollow.push(event);
            eventsForUnfollow.forEach(ev => {
                if (ev in events) {
                    events[ev] = events[ev].filter(follower => follower.context !== context);
                }
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            console.info(event);
            let calledEvents = [event];
            const multiEvents = event.match(/(\w+)\.\w+/);
            if (multiEvents) {
                calledEvents = multiEvents;
            }
            calledEvents.forEach(ev => {
                if (ev in events) {
                    events[ev].forEach(follower => follower.handler.call(follower.context));
                }
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
            if (times <= 0) {
                this.on(event, context, handler);
            }
            let countEvents = times;
            this.on(event, context, function () {
                if (countEvents > 0) {
                    handler.call(context);
                }
                countEvents--;
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
            if (frequency <= 0) {
                this.on(event, context, handler);
            }

            let countEvents = 0;

            this.on(event, context, function () {
                if (countEvents % frequency === 0) {
                    handler.call(context);
                }
                countEvents++;
            });

            return this;
        }
    };
}
