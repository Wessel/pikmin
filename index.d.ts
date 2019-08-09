import { WriteStream } from "fs";

declare namespace Pikmin
{
    export const loggers: Pikmin.Collection<Pikmin.instance>;
    export const version: string;
    export const colors: Pikmin.Colors;

    export function bind(i: Pikmin.instance, a?: Console, b?: any): void;
    export function unbind(i: Pikmin.instance): void;

    export class instance {
        constructor(options?: Pikmin.InstanceOptions);

        public log: {
            [x: string]: any;

            __bound__: Console;
        }

        /** The name of the instance */
        public name: string;

        /** The base format */
        public baseFormat: string;

        /** An array of transports */
        public transports: Pikmin.Transport[];

        /**
         * Adds a transport
         * @param transport The transport to add 
         * @param options Any options to bind
         */
        public addTransport(transport: Pikmin.Transport, options?: { autogen: boolean }): void;
    }

    export class Collection<T> extends Map<string | number, T>
    {
        public filter(i: (a: T) => boolean): T[];
        public map(i: (a: T) => any): T[];
    }

    /** 
     * The console transport that logs anything to the terminal
     */
    export class ConsoleTransport implements Transport
    {
        constructor(options: Pikmin.InstanceOptions & { process: NodeJS.Process });

        /** The type of the transport, implemented by the Transport interface */
        public type: 'CONSOLE' | 'WEBHOOK' | 'FILE';

        /** The name of the transport, implemented by the Transport interface */
        public name: string;

        /** The parent of the transport, implemented by the Transport interface; resolves by `undefined` */
        public parent: any | undefined;

        /** The defaults of the transport, implemented by the Transport interface */
        public defaults: { inspect: boolean }

        /** The NodeJS.Process tty, only to use Stdout#write */
        public process: NodeJS.Process;
        append(options: { inspect: boolean }, data: string): void;
        destroy(): this;
    }

    export class FileTransport implements Transport
    {
        constructor(options: { file: string, flags?: '-a', format: string });

        /** The type of the transport, implemented by the Transport interface */
        public type: 'CONSOLE' | 'WEBHOOK' | 'FILE';

        /** The name of the transport, implemented by the Transport interface */
        public name: string;

        /** The parent of the transport, implemented by the Transport interface; resolves by `undefined` */
        public parent: any | undefined;

        /** The defaults of the transport, implemented by the Transport interface */
        public defaults: { inspect: boolean }

        /** The write stream */
        public stream: WriteStream;
        append(options: { inspect: boolean }, data: string): void;
        destroy(): this;
    }

    /** The colors interface, run by `Pikmin.colors` */
    export interface Colors
    {
        black: Color;
        red: Color;
        green: Color;
        yellow: Color;
        blue: Color;
        magenta: Color;
        cyan: Color;
        white: Color;
        bgBlack: Color;
        bgRed: Color;
        bgGreen: Color;
        bgYellow: Color;
        bgBlue: Color;
        bgCyan: Color;
        bgWhite: Color;
        blackBright: Color;
        redBright: Color;
        greenBright: Color;
        yellowBright: Color;
        blueBright: Color;
        magentaBright: Color;
        cyanBright: Color;
        whiteBright: Color;
        bgBlackBright: Color;
        bgRedBright: Color;
        bgGreenBright: Color;
        bgYellowBright: Color;
        bgBlueBright: Color;
        bgMagentaBright: Color;
        bgCyanBright: Color;
        bgWhiteBright: Color;
        reset: Color;
        bold: Color;
        dim: Color;
        italic: Color;
        underline: Color;
        blink: Color;
        inverse: Color;
        strikethrough: Color;
        strip: (val: string) => string;
        supported: boolean;
    }

    export interface InstanceOptions
    {
        name?: string;
        format?: string;
        autogen?: boolean;
        transports?: Pikmin.Transport[];
    }

    export interface Transport
    {
        type: 'CONSOLE' | 'WEBHOOK' | 'FILE';
        name: string;
        parent: any | undefined;
        defaults: {
            inspect: boolean
        }
        append(options: { inspect: boolean }, data: string): void;
        destroy(): this;
    }

    export type Color = (s: string) => string;
}

export = Pikmin;
