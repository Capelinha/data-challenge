import { attribute, autoGeneratedHashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { IsNotEmpty } from 'class-validator';
import * as Moment from 'moment-timezone';

@table('consultaSocioResult')
export class ConsultaSocioResult {
    @autoGeneratedHashKey()
    public searchid: string;

    @IsNotEmpty()
    @attribute()
    public personId: string;

    @IsNotEmpty()
    @attribute()
    public informations: string[];

    @IsNotEmpty()
    @attribute()
    public companies: object[];

    @attribute({
        defaultProvider: () =>
            Moment()
                .tz('America/Sao_Paulo')
                .valueOf(),
    })
    public createdAt: number;
}