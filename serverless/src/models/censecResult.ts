import { attribute, autoGeneratedHashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { IsNotEmpty, IsArray } from 'class-validator';
import * as Moment from 'moment-timezone';

@table('censecResult')
export class CensecResult {
    @autoGeneratedHashKey()
    public searchid: string;

    @IsNotEmpty()
    @IsArray()
    @attribute()
    public results: {
        name: string,
        document: string,
        identity: string,
        registry: string,
        type: string,
        book: string,
        page: string,
        date: string,
        members: {
            name: string,
            document: string,
            quality: string,
        }[],
    }[];

    @IsNotEmpty()
    @attribute()
    public personId: string;

    @attribute({
        defaultProvider: () =>
            Moment()
                .tz('America/Sao_Paulo')
                .valueOf(),
    })
    public createdAt: number;
}