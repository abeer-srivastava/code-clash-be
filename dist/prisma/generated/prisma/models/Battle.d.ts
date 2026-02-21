import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model Battle
 *
 */
export type BattleModel = runtime.Types.Result.DefaultSelection<Prisma.$BattlePayload>;
export type AggregateBattle = {
    _count: BattleCountAggregateOutputType | null;
    _avg: BattleAvgAggregateOutputType | null;
    _sum: BattleSumAggregateOutputType | null;
    _min: BattleMinAggregateOutputType | null;
    _max: BattleMaxAggregateOutputType | null;
};
export type BattleAvgAggregateOutputType = {
    id: number | null;
    roomId: number | null;
    questionId: number | null;
};
export type BattleSumAggregateOutputType = {
    id: number | null;
    roomId: number | null;
    questionId: number | null;
};
export type BattleMinAggregateOutputType = {
    id: number | null;
    roomId: number | null;
    questionId: number | null;
    player1Id: string | null;
    player2Id: string | null;
    winnerId: string | null;
    startedAt: Date | null;
    endedAt: Date | null;
    status: string | null;
};
export type BattleMaxAggregateOutputType = {
    id: number | null;
    roomId: number | null;
    questionId: number | null;
    player1Id: string | null;
    player2Id: string | null;
    winnerId: string | null;
    startedAt: Date | null;
    endedAt: Date | null;
    status: string | null;
};
export type BattleCountAggregateOutputType = {
    id: number;
    roomId: number;
    questionId: number;
    player1Id: number;
    player2Id: number;
    winnerId: number;
    startedAt: number;
    endedAt: number;
    status: number;
    _all: number;
};
export type BattleAvgAggregateInputType = {
    id?: true;
    roomId?: true;
    questionId?: true;
};
export type BattleSumAggregateInputType = {
    id?: true;
    roomId?: true;
    questionId?: true;
};
export type BattleMinAggregateInputType = {
    id?: true;
    roomId?: true;
    questionId?: true;
    player1Id?: true;
    player2Id?: true;
    winnerId?: true;
    startedAt?: true;
    endedAt?: true;
    status?: true;
};
export type BattleMaxAggregateInputType = {
    id?: true;
    roomId?: true;
    questionId?: true;
    player1Id?: true;
    player2Id?: true;
    winnerId?: true;
    startedAt?: true;
    endedAt?: true;
    status?: true;
};
export type BattleCountAggregateInputType = {
    id?: true;
    roomId?: true;
    questionId?: true;
    player1Id?: true;
    player2Id?: true;
    winnerId?: true;
    startedAt?: true;
    endedAt?: true;
    status?: true;
    _all?: true;
};
export type BattleAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Battle to aggregate.
     */
    where?: Prisma.BattleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Battles to fetch.
     */
    orderBy?: Prisma.BattleOrderByWithRelationInput | Prisma.BattleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.BattleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Battles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Battles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Battles
    **/
    _count?: true | BattleCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: BattleAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: BattleSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: BattleMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: BattleMaxAggregateInputType;
};
export type GetBattleAggregateType<T extends BattleAggregateArgs> = {
    [P in keyof T & keyof AggregateBattle]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBattle[P]> : Prisma.GetScalarType<T[P], AggregateBattle[P]>;
};
export type BattleGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BattleWhereInput;
    orderBy?: Prisma.BattleOrderByWithAggregationInput | Prisma.BattleOrderByWithAggregationInput[];
    by: Prisma.BattleScalarFieldEnum[] | Prisma.BattleScalarFieldEnum;
    having?: Prisma.BattleScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BattleCountAggregateInputType | true;
    _avg?: BattleAvgAggregateInputType;
    _sum?: BattleSumAggregateInputType;
    _min?: BattleMinAggregateInputType;
    _max?: BattleMaxAggregateInputType;
};
export type BattleGroupByOutputType = {
    id: number;
    roomId: number;
    questionId: number;
    player1Id: string;
    player2Id: string;
    winnerId: string | null;
    startedAt: Date;
    endedAt: Date | null;
    status: string;
    _count: BattleCountAggregateOutputType | null;
    _avg: BattleAvgAggregateOutputType | null;
    _sum: BattleSumAggregateOutputType | null;
    _min: BattleMinAggregateOutputType | null;
    _max: BattleMaxAggregateOutputType | null;
};
type GetBattleGroupByPayload<T extends BattleGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BattleGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BattleGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BattleGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BattleGroupByOutputType[P]>;
}>>;
export type BattleWhereInput = {
    AND?: Prisma.BattleWhereInput | Prisma.BattleWhereInput[];
    OR?: Prisma.BattleWhereInput[];
    NOT?: Prisma.BattleWhereInput | Prisma.BattleWhereInput[];
    id?: Prisma.IntFilter<"Battle"> | number;
    roomId?: Prisma.IntFilter<"Battle"> | number;
    questionId?: Prisma.IntFilter<"Battle"> | number;
    player1Id?: Prisma.StringFilter<"Battle"> | string;
    player2Id?: Prisma.StringFilter<"Battle"> | string;
    winnerId?: Prisma.StringNullableFilter<"Battle"> | string | null;
    startedAt?: Prisma.DateTimeFilter<"Battle"> | Date | string;
    endedAt?: Prisma.DateTimeNullableFilter<"Battle"> | Date | string | null;
    status?: Prisma.StringFilter<"Battle"> | string;
    room?: Prisma.XOR<Prisma.RoomScalarRelationFilter, Prisma.RoomWhereInput>;
    question?: Prisma.XOR<Prisma.QuestionScalarRelationFilter, Prisma.QuestionWhereInput>;
    player1?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    player2?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    winner?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type BattleOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    roomId?: Prisma.SortOrder;
    questionId?: Prisma.SortOrder;
    player1Id?: Prisma.SortOrder;
    player2Id?: Prisma.SortOrder;
    winnerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    endedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    room?: Prisma.RoomOrderByWithRelationInput;
    question?: Prisma.QuestionOrderByWithRelationInput;
    player1?: Prisma.UserOrderByWithRelationInput;
    player2?: Prisma.UserOrderByWithRelationInput;
    winner?: Prisma.UserOrderByWithRelationInput;
};
export type BattleWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    roomId?: number;
    AND?: Prisma.BattleWhereInput | Prisma.BattleWhereInput[];
    OR?: Prisma.BattleWhereInput[];
    NOT?: Prisma.BattleWhereInput | Prisma.BattleWhereInput[];
    questionId?: Prisma.IntFilter<"Battle"> | number;
    player1Id?: Prisma.StringFilter<"Battle"> | string;
    player2Id?: Prisma.StringFilter<"Battle"> | string;
    winnerId?: Prisma.StringNullableFilter<"Battle"> | string | null;
    startedAt?: Prisma.DateTimeFilter<"Battle"> | Date | string;
    endedAt?: Prisma.DateTimeNullableFilter<"Battle"> | Date | string | null;
    status?: Prisma.StringFilter<"Battle"> | string;
    room?: Prisma.XOR<Prisma.RoomScalarRelationFilter, Prisma.RoomWhereInput>;
    question?: Prisma.XOR<Prisma.QuestionScalarRelationFilter, Prisma.QuestionWhereInput>;
    player1?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    player2?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    winner?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id" | "roomId">;
export type BattleOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    roomId?: Prisma.SortOrder;
    questionId?: Prisma.SortOrder;
    player1Id?: Prisma.SortOrder;
    player2Id?: Prisma.SortOrder;
    winnerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    endedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    _count?: Prisma.BattleCountOrderByAggregateInput;
    _avg?: Prisma.BattleAvgOrderByAggregateInput;
    _max?: Prisma.BattleMaxOrderByAggregateInput;
    _min?: Prisma.BattleMinOrderByAggregateInput;
    _sum?: Prisma.BattleSumOrderByAggregateInput;
};
export type BattleScalarWhereWithAggregatesInput = {
    AND?: Prisma.BattleScalarWhereWithAggregatesInput | Prisma.BattleScalarWhereWithAggregatesInput[];
    OR?: Prisma.BattleScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BattleScalarWhereWithAggregatesInput | Prisma.BattleScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Battle"> | number;
    roomId?: Prisma.IntWithAggregatesFilter<"Battle"> | number;
    questionId?: Prisma.IntWithAggregatesFilter<"Battle"> | number;
    player1Id?: Prisma.StringWithAggregatesFilter<"Battle"> | string;
    player2Id?: Prisma.StringWithAggregatesFilter<"Battle"> | string;
    winnerId?: Prisma.StringNullableWithAggregatesFilter<"Battle"> | string | null;
    startedAt?: Prisma.DateTimeWithAggregatesFilter<"Battle"> | Date | string;
    endedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Battle"> | Date | string | null;
    status?: Prisma.StringWithAggregatesFilter<"Battle"> | string;
};
export type BattleCreateInput = {
    startedAt?: Date | string;
    endedAt?: Date | string | null;
    status?: string;
    room: Prisma.RoomCreateNestedOneWithoutBattleInput;
    question: Prisma.QuestionCreateNestedOneWithoutBattlesInput;
    player1: Prisma.UserCreateNestedOneWithoutPlayer1BattlesInput;
    player2: Prisma.UserCreateNestedOneWithoutPlayer2BattlesInput;
    winner?: Prisma.UserCreateNestedOneWithoutWinnerBattlesInput;
};
export type BattleUncheckedCreateInput = {
    id?: number;
    roomId: number;
    questionId: number;
    player1Id: string;
    player2Id: string;
    winnerId?: string | null;
    startedAt?: Date | string;
    endedAt?: Date | string | null;
    status?: string;
};
export type BattleUpdateInput = {
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    room?: Prisma.RoomUpdateOneRequiredWithoutBattleNestedInput;
    question?: Prisma.QuestionUpdateOneRequiredWithoutBattlesNestedInput;
    player1?: Prisma.UserUpdateOneRequiredWithoutPlayer1BattlesNestedInput;
    player2?: Prisma.UserUpdateOneRequiredWithoutPlayer2BattlesNestedInput;
    winner?: Prisma.UserUpdateOneWithoutWinnerBattlesNestedInput;
};
export type BattleUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    roomId?: Prisma.IntFieldUpdateOperationsInput | number;
    questionId?: Prisma.IntFieldUpdateOperationsInput | number;
    player1Id?: Prisma.StringFieldUpdateOperationsInput | string;
    player2Id?: Prisma.StringFieldUpdateOperationsInput | string;
    winnerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type BattleCreateManyInput = {
    id?: number;
    roomId: number;
    questionId: number;
    player1Id: string;
    player2Id: string;
    winnerId?: string | null;
    startedAt?: Date | string;
    endedAt?: Date | string | null;
    status?: string;
};
export type BattleUpdateManyMutationInput = {
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type BattleUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    roomId?: Prisma.IntFieldUpdateOperationsInput | number;
    questionId?: Prisma.IntFieldUpdateOperationsInput | number;
    player1Id?: Prisma.StringFieldUpdateOperationsInput | string;
    player2Id?: Prisma.StringFieldUpdateOperationsInput | string;
    winnerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type BattleListRelationFilter = {
    every?: Prisma.BattleWhereInput;
    some?: Prisma.BattleWhereInput;
    none?: Prisma.BattleWhereInput;
};
export type BattleOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BattleCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    roomId?: Prisma.SortOrder;
    questionId?: Prisma.SortOrder;
    player1Id?: Prisma.SortOrder;
    player2Id?: Prisma.SortOrder;
    winnerId?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    endedAt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
};
export type BattleAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    roomId?: Prisma.SortOrder;
    questionId?: Prisma.SortOrder;
};
export type BattleMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    roomId?: Prisma.SortOrder;
    questionId?: Prisma.SortOrder;
    player1Id?: Prisma.SortOrder;
    player2Id?: Prisma.SortOrder;
    winnerId?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    endedAt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
};
export type BattleMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    roomId?: Prisma.SortOrder;
    questionId?: Prisma.SortOrder;
    player1Id?: Prisma.SortOrder;
    player2Id?: Prisma.SortOrder;
    winnerId?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    endedAt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
};
export type BattleSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    roomId?: Prisma.SortOrder;
    questionId?: Prisma.SortOrder;
};
export type BattleCreateNestedManyWithoutPlayer1Input = {
    create?: Prisma.XOR<Prisma.BattleCreateWithoutPlayer1Input, Prisma.BattleUncheckedCreateWithoutPlayer1Input> | Prisma.BattleCreateWithoutPlayer1Input[] | Prisma.BattleUncheckedCreateWithoutPlayer1Input[];
    connectOrCreate?: Prisma.BattleCreateOrConnectWithoutPlayer1Input | Prisma.BattleCreateOrConnectWithoutPlayer1Input[];
    createMany?: Prisma.BattleCreateManyPlayer1InputEnvelope;
    connect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
};
export type BattleCreateNestedManyWithoutPlayer2Input = {
    create?: Prisma.XOR<Prisma.BattleCreateWithoutPlayer2Input, Prisma.BattleUncheckedCreateWithoutPlayer2Input> | Prisma.BattleCreateWithoutPlayer2Input[] | Prisma.BattleUncheckedCreateWithoutPlayer2Input[];
    connectOrCreate?: Prisma.BattleCreateOrConnectWithoutPlayer2Input | Prisma.BattleCreateOrConnectWithoutPlayer2Input[];
    createMany?: Prisma.BattleCreateManyPlayer2InputEnvelope;
    connect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
};
export type BattleCreateNestedManyWithoutWinnerInput = {
    create?: Prisma.XOR<Prisma.BattleCreateWithoutWinnerInput, Prisma.BattleUncheckedCreateWithoutWinnerInput> | Prisma.BattleCreateWithoutWinnerInput[] | Prisma.BattleUncheckedCreateWithoutWinnerInput[];
    connectOrCreate?: Prisma.BattleCreateOrConnectWithoutWinnerInput | Prisma.BattleCreateOrConnectWithoutWinnerInput[];
    createMany?: Prisma.BattleCreateManyWinnerInputEnvelope;
    connect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
};
export type BattleUncheckedCreateNestedManyWithoutPlayer1Input = {
    create?: Prisma.XOR<Prisma.BattleCreateWithoutPlayer1Input, Prisma.BattleUncheckedCreateWithoutPlayer1Input> | Prisma.BattleCreateWithoutPlayer1Input[] | Prisma.BattleUncheckedCreateWithoutPlayer1Input[];
    connectOrCreate?: Prisma.BattleCreateOrConnectWithoutPlayer1Input | Prisma.BattleCreateOrConnectWithoutPlayer1Input[];
    createMany?: Prisma.BattleCreateManyPlayer1InputEnvelope;
    connect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
};
export type BattleUncheckedCreateNestedManyWithoutPlayer2Input = {
    create?: Prisma.XOR<Prisma.BattleCreateWithoutPlayer2Input, Prisma.BattleUncheckedCreateWithoutPlayer2Input> | Prisma.BattleCreateWithoutPlayer2Input[] | Prisma.BattleUncheckedCreateWithoutPlayer2Input[];
    connectOrCreate?: Prisma.BattleCreateOrConnectWithoutPlayer2Input | Prisma.BattleCreateOrConnectWithoutPlayer2Input[];
    createMany?: Prisma.BattleCreateManyPlayer2InputEnvelope;
    connect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
};
export type BattleUncheckedCreateNestedManyWithoutWinnerInput = {
    create?: Prisma.XOR<Prisma.BattleCreateWithoutWinnerInput, Prisma.BattleUncheckedCreateWithoutWinnerInput> | Prisma.BattleCreateWithoutWinnerInput[] | Prisma.BattleUncheckedCreateWithoutWinnerInput[];
    connectOrCreate?: Prisma.BattleCreateOrConnectWithoutWinnerInput | Prisma.BattleCreateOrConnectWithoutWinnerInput[];
    createMany?: Prisma.BattleCreateManyWinnerInputEnvelope;
    connect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
};
export type BattleUpdateManyWithoutPlayer1NestedInput = {
    create?: Prisma.XOR<Prisma.BattleCreateWithoutPlayer1Input, Prisma.BattleUncheckedCreateWithoutPlayer1Input> | Prisma.BattleCreateWithoutPlayer1Input[] | Prisma.BattleUncheckedCreateWithoutPlayer1Input[];
    connectOrCreate?: Prisma.BattleCreateOrConnectWithoutPlayer1Input | Prisma.BattleCreateOrConnectWithoutPlayer1Input[];
    upsert?: Prisma.BattleUpsertWithWhereUniqueWithoutPlayer1Input | Prisma.BattleUpsertWithWhereUniqueWithoutPlayer1Input[];
    createMany?: Prisma.BattleCreateManyPlayer1InputEnvelope;
    set?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    disconnect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    delete?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    connect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    update?: Prisma.BattleUpdateWithWhereUniqueWithoutPlayer1Input | Prisma.BattleUpdateWithWhereUniqueWithoutPlayer1Input[];
    updateMany?: Prisma.BattleUpdateManyWithWhereWithoutPlayer1Input | Prisma.BattleUpdateManyWithWhereWithoutPlayer1Input[];
    deleteMany?: Prisma.BattleScalarWhereInput | Prisma.BattleScalarWhereInput[];
};
export type BattleUpdateManyWithoutPlayer2NestedInput = {
    create?: Prisma.XOR<Prisma.BattleCreateWithoutPlayer2Input, Prisma.BattleUncheckedCreateWithoutPlayer2Input> | Prisma.BattleCreateWithoutPlayer2Input[] | Prisma.BattleUncheckedCreateWithoutPlayer2Input[];
    connectOrCreate?: Prisma.BattleCreateOrConnectWithoutPlayer2Input | Prisma.BattleCreateOrConnectWithoutPlayer2Input[];
    upsert?: Prisma.BattleUpsertWithWhereUniqueWithoutPlayer2Input | Prisma.BattleUpsertWithWhereUniqueWithoutPlayer2Input[];
    createMany?: Prisma.BattleCreateManyPlayer2InputEnvelope;
    set?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    disconnect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    delete?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    connect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    update?: Prisma.BattleUpdateWithWhereUniqueWithoutPlayer2Input | Prisma.BattleUpdateWithWhereUniqueWithoutPlayer2Input[];
    updateMany?: Prisma.BattleUpdateManyWithWhereWithoutPlayer2Input | Prisma.BattleUpdateManyWithWhereWithoutPlayer2Input[];
    deleteMany?: Prisma.BattleScalarWhereInput | Prisma.BattleScalarWhereInput[];
};
export type BattleUpdateManyWithoutWinnerNestedInput = {
    create?: Prisma.XOR<Prisma.BattleCreateWithoutWinnerInput, Prisma.BattleUncheckedCreateWithoutWinnerInput> | Prisma.BattleCreateWithoutWinnerInput[] | Prisma.BattleUncheckedCreateWithoutWinnerInput[];
    connectOrCreate?: Prisma.BattleCreateOrConnectWithoutWinnerInput | Prisma.BattleCreateOrConnectWithoutWinnerInput[];
    upsert?: Prisma.BattleUpsertWithWhereUniqueWithoutWinnerInput | Prisma.BattleUpsertWithWhereUniqueWithoutWinnerInput[];
    createMany?: Prisma.BattleCreateManyWinnerInputEnvelope;
    set?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    disconnect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    delete?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    connect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    update?: Prisma.BattleUpdateWithWhereUniqueWithoutWinnerInput | Prisma.BattleUpdateWithWhereUniqueWithoutWinnerInput[];
    updateMany?: Prisma.BattleUpdateManyWithWhereWithoutWinnerInput | Prisma.BattleUpdateManyWithWhereWithoutWinnerInput[];
    deleteMany?: Prisma.BattleScalarWhereInput | Prisma.BattleScalarWhereInput[];
};
export type BattleUncheckedUpdateManyWithoutPlayer1NestedInput = {
    create?: Prisma.XOR<Prisma.BattleCreateWithoutPlayer1Input, Prisma.BattleUncheckedCreateWithoutPlayer1Input> | Prisma.BattleCreateWithoutPlayer1Input[] | Prisma.BattleUncheckedCreateWithoutPlayer1Input[];
    connectOrCreate?: Prisma.BattleCreateOrConnectWithoutPlayer1Input | Prisma.BattleCreateOrConnectWithoutPlayer1Input[];
    upsert?: Prisma.BattleUpsertWithWhereUniqueWithoutPlayer1Input | Prisma.BattleUpsertWithWhereUniqueWithoutPlayer1Input[];
    createMany?: Prisma.BattleCreateManyPlayer1InputEnvelope;
    set?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    disconnect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    delete?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    connect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    update?: Prisma.BattleUpdateWithWhereUniqueWithoutPlayer1Input | Prisma.BattleUpdateWithWhereUniqueWithoutPlayer1Input[];
    updateMany?: Prisma.BattleUpdateManyWithWhereWithoutPlayer1Input | Prisma.BattleUpdateManyWithWhereWithoutPlayer1Input[];
    deleteMany?: Prisma.BattleScalarWhereInput | Prisma.BattleScalarWhereInput[];
};
export type BattleUncheckedUpdateManyWithoutPlayer2NestedInput = {
    create?: Prisma.XOR<Prisma.BattleCreateWithoutPlayer2Input, Prisma.BattleUncheckedCreateWithoutPlayer2Input> | Prisma.BattleCreateWithoutPlayer2Input[] | Prisma.BattleUncheckedCreateWithoutPlayer2Input[];
    connectOrCreate?: Prisma.BattleCreateOrConnectWithoutPlayer2Input | Prisma.BattleCreateOrConnectWithoutPlayer2Input[];
    upsert?: Prisma.BattleUpsertWithWhereUniqueWithoutPlayer2Input | Prisma.BattleUpsertWithWhereUniqueWithoutPlayer2Input[];
    createMany?: Prisma.BattleCreateManyPlayer2InputEnvelope;
    set?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    disconnect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    delete?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    connect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    update?: Prisma.BattleUpdateWithWhereUniqueWithoutPlayer2Input | Prisma.BattleUpdateWithWhereUniqueWithoutPlayer2Input[];
    updateMany?: Prisma.BattleUpdateManyWithWhereWithoutPlayer2Input | Prisma.BattleUpdateManyWithWhereWithoutPlayer2Input[];
    deleteMany?: Prisma.BattleScalarWhereInput | Prisma.BattleScalarWhereInput[];
};
export type BattleUncheckedUpdateManyWithoutWinnerNestedInput = {
    create?: Prisma.XOR<Prisma.BattleCreateWithoutWinnerInput, Prisma.BattleUncheckedCreateWithoutWinnerInput> | Prisma.BattleCreateWithoutWinnerInput[] | Prisma.BattleUncheckedCreateWithoutWinnerInput[];
    connectOrCreate?: Prisma.BattleCreateOrConnectWithoutWinnerInput | Prisma.BattleCreateOrConnectWithoutWinnerInput[];
    upsert?: Prisma.BattleUpsertWithWhereUniqueWithoutWinnerInput | Prisma.BattleUpsertWithWhereUniqueWithoutWinnerInput[];
    createMany?: Prisma.BattleCreateManyWinnerInputEnvelope;
    set?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    disconnect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    delete?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    connect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    update?: Prisma.BattleUpdateWithWhereUniqueWithoutWinnerInput | Prisma.BattleUpdateWithWhereUniqueWithoutWinnerInput[];
    updateMany?: Prisma.BattleUpdateManyWithWhereWithoutWinnerInput | Prisma.BattleUpdateManyWithWhereWithoutWinnerInput[];
    deleteMany?: Prisma.BattleScalarWhereInput | Prisma.BattleScalarWhereInput[];
};
export type BattleCreateNestedManyWithoutRoomInput = {
    create?: Prisma.XOR<Prisma.BattleCreateWithoutRoomInput, Prisma.BattleUncheckedCreateWithoutRoomInput> | Prisma.BattleCreateWithoutRoomInput[] | Prisma.BattleUncheckedCreateWithoutRoomInput[];
    connectOrCreate?: Prisma.BattleCreateOrConnectWithoutRoomInput | Prisma.BattleCreateOrConnectWithoutRoomInput[];
    createMany?: Prisma.BattleCreateManyRoomInputEnvelope;
    connect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
};
export type BattleUncheckedCreateNestedManyWithoutRoomInput = {
    create?: Prisma.XOR<Prisma.BattleCreateWithoutRoomInput, Prisma.BattleUncheckedCreateWithoutRoomInput> | Prisma.BattleCreateWithoutRoomInput[] | Prisma.BattleUncheckedCreateWithoutRoomInput[];
    connectOrCreate?: Prisma.BattleCreateOrConnectWithoutRoomInput | Prisma.BattleCreateOrConnectWithoutRoomInput[];
    createMany?: Prisma.BattleCreateManyRoomInputEnvelope;
    connect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
};
export type BattleUpdateManyWithoutRoomNestedInput = {
    create?: Prisma.XOR<Prisma.BattleCreateWithoutRoomInput, Prisma.BattleUncheckedCreateWithoutRoomInput> | Prisma.BattleCreateWithoutRoomInput[] | Prisma.BattleUncheckedCreateWithoutRoomInput[];
    connectOrCreate?: Prisma.BattleCreateOrConnectWithoutRoomInput | Prisma.BattleCreateOrConnectWithoutRoomInput[];
    upsert?: Prisma.BattleUpsertWithWhereUniqueWithoutRoomInput | Prisma.BattleUpsertWithWhereUniqueWithoutRoomInput[];
    createMany?: Prisma.BattleCreateManyRoomInputEnvelope;
    set?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    disconnect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    delete?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    connect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    update?: Prisma.BattleUpdateWithWhereUniqueWithoutRoomInput | Prisma.BattleUpdateWithWhereUniqueWithoutRoomInput[];
    updateMany?: Prisma.BattleUpdateManyWithWhereWithoutRoomInput | Prisma.BattleUpdateManyWithWhereWithoutRoomInput[];
    deleteMany?: Prisma.BattleScalarWhereInput | Prisma.BattleScalarWhereInput[];
};
export type BattleUncheckedUpdateManyWithoutRoomNestedInput = {
    create?: Prisma.XOR<Prisma.BattleCreateWithoutRoomInput, Prisma.BattleUncheckedCreateWithoutRoomInput> | Prisma.BattleCreateWithoutRoomInput[] | Prisma.BattleUncheckedCreateWithoutRoomInput[];
    connectOrCreate?: Prisma.BattleCreateOrConnectWithoutRoomInput | Prisma.BattleCreateOrConnectWithoutRoomInput[];
    upsert?: Prisma.BattleUpsertWithWhereUniqueWithoutRoomInput | Prisma.BattleUpsertWithWhereUniqueWithoutRoomInput[];
    createMany?: Prisma.BattleCreateManyRoomInputEnvelope;
    set?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    disconnect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    delete?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    connect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    update?: Prisma.BattleUpdateWithWhereUniqueWithoutRoomInput | Prisma.BattleUpdateWithWhereUniqueWithoutRoomInput[];
    updateMany?: Prisma.BattleUpdateManyWithWhereWithoutRoomInput | Prisma.BattleUpdateManyWithWhereWithoutRoomInput[];
    deleteMany?: Prisma.BattleScalarWhereInput | Prisma.BattleScalarWhereInput[];
};
export type BattleCreateNestedManyWithoutQuestionInput = {
    create?: Prisma.XOR<Prisma.BattleCreateWithoutQuestionInput, Prisma.BattleUncheckedCreateWithoutQuestionInput> | Prisma.BattleCreateWithoutQuestionInput[] | Prisma.BattleUncheckedCreateWithoutQuestionInput[];
    connectOrCreate?: Prisma.BattleCreateOrConnectWithoutQuestionInput | Prisma.BattleCreateOrConnectWithoutQuestionInput[];
    createMany?: Prisma.BattleCreateManyQuestionInputEnvelope;
    connect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
};
export type BattleUncheckedCreateNestedManyWithoutQuestionInput = {
    create?: Prisma.XOR<Prisma.BattleCreateWithoutQuestionInput, Prisma.BattleUncheckedCreateWithoutQuestionInput> | Prisma.BattleCreateWithoutQuestionInput[] | Prisma.BattleUncheckedCreateWithoutQuestionInput[];
    connectOrCreate?: Prisma.BattleCreateOrConnectWithoutQuestionInput | Prisma.BattleCreateOrConnectWithoutQuestionInput[];
    createMany?: Prisma.BattleCreateManyQuestionInputEnvelope;
    connect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
};
export type BattleUpdateManyWithoutQuestionNestedInput = {
    create?: Prisma.XOR<Prisma.BattleCreateWithoutQuestionInput, Prisma.BattleUncheckedCreateWithoutQuestionInput> | Prisma.BattleCreateWithoutQuestionInput[] | Prisma.BattleUncheckedCreateWithoutQuestionInput[];
    connectOrCreate?: Prisma.BattleCreateOrConnectWithoutQuestionInput | Prisma.BattleCreateOrConnectWithoutQuestionInput[];
    upsert?: Prisma.BattleUpsertWithWhereUniqueWithoutQuestionInput | Prisma.BattleUpsertWithWhereUniqueWithoutQuestionInput[];
    createMany?: Prisma.BattleCreateManyQuestionInputEnvelope;
    set?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    disconnect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    delete?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    connect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    update?: Prisma.BattleUpdateWithWhereUniqueWithoutQuestionInput | Prisma.BattleUpdateWithWhereUniqueWithoutQuestionInput[];
    updateMany?: Prisma.BattleUpdateManyWithWhereWithoutQuestionInput | Prisma.BattleUpdateManyWithWhereWithoutQuestionInput[];
    deleteMany?: Prisma.BattleScalarWhereInput | Prisma.BattleScalarWhereInput[];
};
export type BattleUncheckedUpdateManyWithoutQuestionNestedInput = {
    create?: Prisma.XOR<Prisma.BattleCreateWithoutQuestionInput, Prisma.BattleUncheckedCreateWithoutQuestionInput> | Prisma.BattleCreateWithoutQuestionInput[] | Prisma.BattleUncheckedCreateWithoutQuestionInput[];
    connectOrCreate?: Prisma.BattleCreateOrConnectWithoutQuestionInput | Prisma.BattleCreateOrConnectWithoutQuestionInput[];
    upsert?: Prisma.BattleUpsertWithWhereUniqueWithoutQuestionInput | Prisma.BattleUpsertWithWhereUniqueWithoutQuestionInput[];
    createMany?: Prisma.BattleCreateManyQuestionInputEnvelope;
    set?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    disconnect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    delete?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    connect?: Prisma.BattleWhereUniqueInput | Prisma.BattleWhereUniqueInput[];
    update?: Prisma.BattleUpdateWithWhereUniqueWithoutQuestionInput | Prisma.BattleUpdateWithWhereUniqueWithoutQuestionInput[];
    updateMany?: Prisma.BattleUpdateManyWithWhereWithoutQuestionInput | Prisma.BattleUpdateManyWithWhereWithoutQuestionInput[];
    deleteMany?: Prisma.BattleScalarWhereInput | Prisma.BattleScalarWhereInput[];
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type BattleCreateWithoutPlayer1Input = {
    startedAt?: Date | string;
    endedAt?: Date | string | null;
    status?: string;
    room: Prisma.RoomCreateNestedOneWithoutBattleInput;
    question: Prisma.QuestionCreateNestedOneWithoutBattlesInput;
    player2: Prisma.UserCreateNestedOneWithoutPlayer2BattlesInput;
    winner?: Prisma.UserCreateNestedOneWithoutWinnerBattlesInput;
};
export type BattleUncheckedCreateWithoutPlayer1Input = {
    id?: number;
    roomId: number;
    questionId: number;
    player2Id: string;
    winnerId?: string | null;
    startedAt?: Date | string;
    endedAt?: Date | string | null;
    status?: string;
};
export type BattleCreateOrConnectWithoutPlayer1Input = {
    where: Prisma.BattleWhereUniqueInput;
    create: Prisma.XOR<Prisma.BattleCreateWithoutPlayer1Input, Prisma.BattleUncheckedCreateWithoutPlayer1Input>;
};
export type BattleCreateManyPlayer1InputEnvelope = {
    data: Prisma.BattleCreateManyPlayer1Input | Prisma.BattleCreateManyPlayer1Input[];
    skipDuplicates?: boolean;
};
export type BattleCreateWithoutPlayer2Input = {
    startedAt?: Date | string;
    endedAt?: Date | string | null;
    status?: string;
    room: Prisma.RoomCreateNestedOneWithoutBattleInput;
    question: Prisma.QuestionCreateNestedOneWithoutBattlesInput;
    player1: Prisma.UserCreateNestedOneWithoutPlayer1BattlesInput;
    winner?: Prisma.UserCreateNestedOneWithoutWinnerBattlesInput;
};
export type BattleUncheckedCreateWithoutPlayer2Input = {
    id?: number;
    roomId: number;
    questionId: number;
    player1Id: string;
    winnerId?: string | null;
    startedAt?: Date | string;
    endedAt?: Date | string | null;
    status?: string;
};
export type BattleCreateOrConnectWithoutPlayer2Input = {
    where: Prisma.BattleWhereUniqueInput;
    create: Prisma.XOR<Prisma.BattleCreateWithoutPlayer2Input, Prisma.BattleUncheckedCreateWithoutPlayer2Input>;
};
export type BattleCreateManyPlayer2InputEnvelope = {
    data: Prisma.BattleCreateManyPlayer2Input | Prisma.BattleCreateManyPlayer2Input[];
    skipDuplicates?: boolean;
};
export type BattleCreateWithoutWinnerInput = {
    startedAt?: Date | string;
    endedAt?: Date | string | null;
    status?: string;
    room: Prisma.RoomCreateNestedOneWithoutBattleInput;
    question: Prisma.QuestionCreateNestedOneWithoutBattlesInput;
    player1: Prisma.UserCreateNestedOneWithoutPlayer1BattlesInput;
    player2: Prisma.UserCreateNestedOneWithoutPlayer2BattlesInput;
};
export type BattleUncheckedCreateWithoutWinnerInput = {
    id?: number;
    roomId: number;
    questionId: number;
    player1Id: string;
    player2Id: string;
    startedAt?: Date | string;
    endedAt?: Date | string | null;
    status?: string;
};
export type BattleCreateOrConnectWithoutWinnerInput = {
    where: Prisma.BattleWhereUniqueInput;
    create: Prisma.XOR<Prisma.BattleCreateWithoutWinnerInput, Prisma.BattleUncheckedCreateWithoutWinnerInput>;
};
export type BattleCreateManyWinnerInputEnvelope = {
    data: Prisma.BattleCreateManyWinnerInput | Prisma.BattleCreateManyWinnerInput[];
    skipDuplicates?: boolean;
};
export type BattleUpsertWithWhereUniqueWithoutPlayer1Input = {
    where: Prisma.BattleWhereUniqueInput;
    update: Prisma.XOR<Prisma.BattleUpdateWithoutPlayer1Input, Prisma.BattleUncheckedUpdateWithoutPlayer1Input>;
    create: Prisma.XOR<Prisma.BattleCreateWithoutPlayer1Input, Prisma.BattleUncheckedCreateWithoutPlayer1Input>;
};
export type BattleUpdateWithWhereUniqueWithoutPlayer1Input = {
    where: Prisma.BattleWhereUniqueInput;
    data: Prisma.XOR<Prisma.BattleUpdateWithoutPlayer1Input, Prisma.BattleUncheckedUpdateWithoutPlayer1Input>;
};
export type BattleUpdateManyWithWhereWithoutPlayer1Input = {
    where: Prisma.BattleScalarWhereInput;
    data: Prisma.XOR<Prisma.BattleUpdateManyMutationInput, Prisma.BattleUncheckedUpdateManyWithoutPlayer1Input>;
};
export type BattleScalarWhereInput = {
    AND?: Prisma.BattleScalarWhereInput | Prisma.BattleScalarWhereInput[];
    OR?: Prisma.BattleScalarWhereInput[];
    NOT?: Prisma.BattleScalarWhereInput | Prisma.BattleScalarWhereInput[];
    id?: Prisma.IntFilter<"Battle"> | number;
    roomId?: Prisma.IntFilter<"Battle"> | number;
    questionId?: Prisma.IntFilter<"Battle"> | number;
    player1Id?: Prisma.StringFilter<"Battle"> | string;
    player2Id?: Prisma.StringFilter<"Battle"> | string;
    winnerId?: Prisma.StringNullableFilter<"Battle"> | string | null;
    startedAt?: Prisma.DateTimeFilter<"Battle"> | Date | string;
    endedAt?: Prisma.DateTimeNullableFilter<"Battle"> | Date | string | null;
    status?: Prisma.StringFilter<"Battle"> | string;
};
export type BattleUpsertWithWhereUniqueWithoutPlayer2Input = {
    where: Prisma.BattleWhereUniqueInput;
    update: Prisma.XOR<Prisma.BattleUpdateWithoutPlayer2Input, Prisma.BattleUncheckedUpdateWithoutPlayer2Input>;
    create: Prisma.XOR<Prisma.BattleCreateWithoutPlayer2Input, Prisma.BattleUncheckedCreateWithoutPlayer2Input>;
};
export type BattleUpdateWithWhereUniqueWithoutPlayer2Input = {
    where: Prisma.BattleWhereUniqueInput;
    data: Prisma.XOR<Prisma.BattleUpdateWithoutPlayer2Input, Prisma.BattleUncheckedUpdateWithoutPlayer2Input>;
};
export type BattleUpdateManyWithWhereWithoutPlayer2Input = {
    where: Prisma.BattleScalarWhereInput;
    data: Prisma.XOR<Prisma.BattleUpdateManyMutationInput, Prisma.BattleUncheckedUpdateManyWithoutPlayer2Input>;
};
export type BattleUpsertWithWhereUniqueWithoutWinnerInput = {
    where: Prisma.BattleWhereUniqueInput;
    update: Prisma.XOR<Prisma.BattleUpdateWithoutWinnerInput, Prisma.BattleUncheckedUpdateWithoutWinnerInput>;
    create: Prisma.XOR<Prisma.BattleCreateWithoutWinnerInput, Prisma.BattleUncheckedCreateWithoutWinnerInput>;
};
export type BattleUpdateWithWhereUniqueWithoutWinnerInput = {
    where: Prisma.BattleWhereUniqueInput;
    data: Prisma.XOR<Prisma.BattleUpdateWithoutWinnerInput, Prisma.BattleUncheckedUpdateWithoutWinnerInput>;
};
export type BattleUpdateManyWithWhereWithoutWinnerInput = {
    where: Prisma.BattleScalarWhereInput;
    data: Prisma.XOR<Prisma.BattleUpdateManyMutationInput, Prisma.BattleUncheckedUpdateManyWithoutWinnerInput>;
};
export type BattleCreateWithoutRoomInput = {
    startedAt?: Date | string;
    endedAt?: Date | string | null;
    status?: string;
    question: Prisma.QuestionCreateNestedOneWithoutBattlesInput;
    player1: Prisma.UserCreateNestedOneWithoutPlayer1BattlesInput;
    player2: Prisma.UserCreateNestedOneWithoutPlayer2BattlesInput;
    winner?: Prisma.UserCreateNestedOneWithoutWinnerBattlesInput;
};
export type BattleUncheckedCreateWithoutRoomInput = {
    id?: number;
    questionId: number;
    player1Id: string;
    player2Id: string;
    winnerId?: string | null;
    startedAt?: Date | string;
    endedAt?: Date | string | null;
    status?: string;
};
export type BattleCreateOrConnectWithoutRoomInput = {
    where: Prisma.BattleWhereUniqueInput;
    create: Prisma.XOR<Prisma.BattleCreateWithoutRoomInput, Prisma.BattleUncheckedCreateWithoutRoomInput>;
};
export type BattleCreateManyRoomInputEnvelope = {
    data: Prisma.BattleCreateManyRoomInput | Prisma.BattleCreateManyRoomInput[];
    skipDuplicates?: boolean;
};
export type BattleUpsertWithWhereUniqueWithoutRoomInput = {
    where: Prisma.BattleWhereUniqueInput;
    update: Prisma.XOR<Prisma.BattleUpdateWithoutRoomInput, Prisma.BattleUncheckedUpdateWithoutRoomInput>;
    create: Prisma.XOR<Prisma.BattleCreateWithoutRoomInput, Prisma.BattleUncheckedCreateWithoutRoomInput>;
};
export type BattleUpdateWithWhereUniqueWithoutRoomInput = {
    where: Prisma.BattleWhereUniqueInput;
    data: Prisma.XOR<Prisma.BattleUpdateWithoutRoomInput, Prisma.BattleUncheckedUpdateWithoutRoomInput>;
};
export type BattleUpdateManyWithWhereWithoutRoomInput = {
    where: Prisma.BattleScalarWhereInput;
    data: Prisma.XOR<Prisma.BattleUpdateManyMutationInput, Prisma.BattleUncheckedUpdateManyWithoutRoomInput>;
};
export type BattleCreateWithoutQuestionInput = {
    startedAt?: Date | string;
    endedAt?: Date | string | null;
    status?: string;
    room: Prisma.RoomCreateNestedOneWithoutBattleInput;
    player1: Prisma.UserCreateNestedOneWithoutPlayer1BattlesInput;
    player2: Prisma.UserCreateNestedOneWithoutPlayer2BattlesInput;
    winner?: Prisma.UserCreateNestedOneWithoutWinnerBattlesInput;
};
export type BattleUncheckedCreateWithoutQuestionInput = {
    id?: number;
    roomId: number;
    player1Id: string;
    player2Id: string;
    winnerId?: string | null;
    startedAt?: Date | string;
    endedAt?: Date | string | null;
    status?: string;
};
export type BattleCreateOrConnectWithoutQuestionInput = {
    where: Prisma.BattleWhereUniqueInput;
    create: Prisma.XOR<Prisma.BattleCreateWithoutQuestionInput, Prisma.BattleUncheckedCreateWithoutQuestionInput>;
};
export type BattleCreateManyQuestionInputEnvelope = {
    data: Prisma.BattleCreateManyQuestionInput | Prisma.BattleCreateManyQuestionInput[];
    skipDuplicates?: boolean;
};
export type BattleUpsertWithWhereUniqueWithoutQuestionInput = {
    where: Prisma.BattleWhereUniqueInput;
    update: Prisma.XOR<Prisma.BattleUpdateWithoutQuestionInput, Prisma.BattleUncheckedUpdateWithoutQuestionInput>;
    create: Prisma.XOR<Prisma.BattleCreateWithoutQuestionInput, Prisma.BattleUncheckedCreateWithoutQuestionInput>;
};
export type BattleUpdateWithWhereUniqueWithoutQuestionInput = {
    where: Prisma.BattleWhereUniqueInput;
    data: Prisma.XOR<Prisma.BattleUpdateWithoutQuestionInput, Prisma.BattleUncheckedUpdateWithoutQuestionInput>;
};
export type BattleUpdateManyWithWhereWithoutQuestionInput = {
    where: Prisma.BattleScalarWhereInput;
    data: Prisma.XOR<Prisma.BattleUpdateManyMutationInput, Prisma.BattleUncheckedUpdateManyWithoutQuestionInput>;
};
export type BattleCreateManyPlayer1Input = {
    id?: number;
    roomId: number;
    questionId: number;
    player2Id: string;
    winnerId?: string | null;
    startedAt?: Date | string;
    endedAt?: Date | string | null;
    status?: string;
};
export type BattleCreateManyPlayer2Input = {
    id?: number;
    roomId: number;
    questionId: number;
    player1Id: string;
    winnerId?: string | null;
    startedAt?: Date | string;
    endedAt?: Date | string | null;
    status?: string;
};
export type BattleCreateManyWinnerInput = {
    id?: number;
    roomId: number;
    questionId: number;
    player1Id: string;
    player2Id: string;
    startedAt?: Date | string;
    endedAt?: Date | string | null;
    status?: string;
};
export type BattleUpdateWithoutPlayer1Input = {
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    room?: Prisma.RoomUpdateOneRequiredWithoutBattleNestedInput;
    question?: Prisma.QuestionUpdateOneRequiredWithoutBattlesNestedInput;
    player2?: Prisma.UserUpdateOneRequiredWithoutPlayer2BattlesNestedInput;
    winner?: Prisma.UserUpdateOneWithoutWinnerBattlesNestedInput;
};
export type BattleUncheckedUpdateWithoutPlayer1Input = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    roomId?: Prisma.IntFieldUpdateOperationsInput | number;
    questionId?: Prisma.IntFieldUpdateOperationsInput | number;
    player2Id?: Prisma.StringFieldUpdateOperationsInput | string;
    winnerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type BattleUncheckedUpdateManyWithoutPlayer1Input = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    roomId?: Prisma.IntFieldUpdateOperationsInput | number;
    questionId?: Prisma.IntFieldUpdateOperationsInput | number;
    player2Id?: Prisma.StringFieldUpdateOperationsInput | string;
    winnerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type BattleUpdateWithoutPlayer2Input = {
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    room?: Prisma.RoomUpdateOneRequiredWithoutBattleNestedInput;
    question?: Prisma.QuestionUpdateOneRequiredWithoutBattlesNestedInput;
    player1?: Prisma.UserUpdateOneRequiredWithoutPlayer1BattlesNestedInput;
    winner?: Prisma.UserUpdateOneWithoutWinnerBattlesNestedInput;
};
export type BattleUncheckedUpdateWithoutPlayer2Input = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    roomId?: Prisma.IntFieldUpdateOperationsInput | number;
    questionId?: Prisma.IntFieldUpdateOperationsInput | number;
    player1Id?: Prisma.StringFieldUpdateOperationsInput | string;
    winnerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type BattleUncheckedUpdateManyWithoutPlayer2Input = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    roomId?: Prisma.IntFieldUpdateOperationsInput | number;
    questionId?: Prisma.IntFieldUpdateOperationsInput | number;
    player1Id?: Prisma.StringFieldUpdateOperationsInput | string;
    winnerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type BattleUpdateWithoutWinnerInput = {
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    room?: Prisma.RoomUpdateOneRequiredWithoutBattleNestedInput;
    question?: Prisma.QuestionUpdateOneRequiredWithoutBattlesNestedInput;
    player1?: Prisma.UserUpdateOneRequiredWithoutPlayer1BattlesNestedInput;
    player2?: Prisma.UserUpdateOneRequiredWithoutPlayer2BattlesNestedInput;
};
export type BattleUncheckedUpdateWithoutWinnerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    roomId?: Prisma.IntFieldUpdateOperationsInput | number;
    questionId?: Prisma.IntFieldUpdateOperationsInput | number;
    player1Id?: Prisma.StringFieldUpdateOperationsInput | string;
    player2Id?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type BattleUncheckedUpdateManyWithoutWinnerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    roomId?: Prisma.IntFieldUpdateOperationsInput | number;
    questionId?: Prisma.IntFieldUpdateOperationsInput | number;
    player1Id?: Prisma.StringFieldUpdateOperationsInput | string;
    player2Id?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type BattleCreateManyRoomInput = {
    id?: number;
    questionId: number;
    player1Id: string;
    player2Id: string;
    winnerId?: string | null;
    startedAt?: Date | string;
    endedAt?: Date | string | null;
    status?: string;
};
export type BattleUpdateWithoutRoomInput = {
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    question?: Prisma.QuestionUpdateOneRequiredWithoutBattlesNestedInput;
    player1?: Prisma.UserUpdateOneRequiredWithoutPlayer1BattlesNestedInput;
    player2?: Prisma.UserUpdateOneRequiredWithoutPlayer2BattlesNestedInput;
    winner?: Prisma.UserUpdateOneWithoutWinnerBattlesNestedInput;
};
export type BattleUncheckedUpdateWithoutRoomInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    questionId?: Prisma.IntFieldUpdateOperationsInput | number;
    player1Id?: Prisma.StringFieldUpdateOperationsInput | string;
    player2Id?: Prisma.StringFieldUpdateOperationsInput | string;
    winnerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type BattleUncheckedUpdateManyWithoutRoomInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    questionId?: Prisma.IntFieldUpdateOperationsInput | number;
    player1Id?: Prisma.StringFieldUpdateOperationsInput | string;
    player2Id?: Prisma.StringFieldUpdateOperationsInput | string;
    winnerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type BattleCreateManyQuestionInput = {
    id?: number;
    roomId: number;
    player1Id: string;
    player2Id: string;
    winnerId?: string | null;
    startedAt?: Date | string;
    endedAt?: Date | string | null;
    status?: string;
};
export type BattleUpdateWithoutQuestionInput = {
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    room?: Prisma.RoomUpdateOneRequiredWithoutBattleNestedInput;
    player1?: Prisma.UserUpdateOneRequiredWithoutPlayer1BattlesNestedInput;
    player2?: Prisma.UserUpdateOneRequiredWithoutPlayer2BattlesNestedInput;
    winner?: Prisma.UserUpdateOneWithoutWinnerBattlesNestedInput;
};
export type BattleUncheckedUpdateWithoutQuestionInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    roomId?: Prisma.IntFieldUpdateOperationsInput | number;
    player1Id?: Prisma.StringFieldUpdateOperationsInput | string;
    player2Id?: Prisma.StringFieldUpdateOperationsInput | string;
    winnerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type BattleUncheckedUpdateManyWithoutQuestionInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    roomId?: Prisma.IntFieldUpdateOperationsInput | number;
    player1Id?: Prisma.StringFieldUpdateOperationsInput | string;
    player2Id?: Prisma.StringFieldUpdateOperationsInput | string;
    winnerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type BattleSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    roomId?: boolean;
    questionId?: boolean;
    player1Id?: boolean;
    player2Id?: boolean;
    winnerId?: boolean;
    startedAt?: boolean;
    endedAt?: boolean;
    status?: boolean;
    room?: boolean | Prisma.RoomDefaultArgs<ExtArgs>;
    question?: boolean | Prisma.QuestionDefaultArgs<ExtArgs>;
    player1?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    player2?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    winner?: boolean | Prisma.Battle$winnerArgs<ExtArgs>;
}, ExtArgs["result"]["battle"]>;
export type BattleSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    roomId?: boolean;
    questionId?: boolean;
    player1Id?: boolean;
    player2Id?: boolean;
    winnerId?: boolean;
    startedAt?: boolean;
    endedAt?: boolean;
    status?: boolean;
    room?: boolean | Prisma.RoomDefaultArgs<ExtArgs>;
    question?: boolean | Prisma.QuestionDefaultArgs<ExtArgs>;
    player1?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    player2?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    winner?: boolean | Prisma.Battle$winnerArgs<ExtArgs>;
}, ExtArgs["result"]["battle"]>;
export type BattleSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    roomId?: boolean;
    questionId?: boolean;
    player1Id?: boolean;
    player2Id?: boolean;
    winnerId?: boolean;
    startedAt?: boolean;
    endedAt?: boolean;
    status?: boolean;
    room?: boolean | Prisma.RoomDefaultArgs<ExtArgs>;
    question?: boolean | Prisma.QuestionDefaultArgs<ExtArgs>;
    player1?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    player2?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    winner?: boolean | Prisma.Battle$winnerArgs<ExtArgs>;
}, ExtArgs["result"]["battle"]>;
export type BattleSelectScalar = {
    id?: boolean;
    roomId?: boolean;
    questionId?: boolean;
    player1Id?: boolean;
    player2Id?: boolean;
    winnerId?: boolean;
    startedAt?: boolean;
    endedAt?: boolean;
    status?: boolean;
};
export type BattleOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "roomId" | "questionId" | "player1Id" | "player2Id" | "winnerId" | "startedAt" | "endedAt" | "status", ExtArgs["result"]["battle"]>;
export type BattleInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    room?: boolean | Prisma.RoomDefaultArgs<ExtArgs>;
    question?: boolean | Prisma.QuestionDefaultArgs<ExtArgs>;
    player1?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    player2?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    winner?: boolean | Prisma.Battle$winnerArgs<ExtArgs>;
};
export type BattleIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    room?: boolean | Prisma.RoomDefaultArgs<ExtArgs>;
    question?: boolean | Prisma.QuestionDefaultArgs<ExtArgs>;
    player1?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    player2?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    winner?: boolean | Prisma.Battle$winnerArgs<ExtArgs>;
};
export type BattleIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    room?: boolean | Prisma.RoomDefaultArgs<ExtArgs>;
    question?: boolean | Prisma.QuestionDefaultArgs<ExtArgs>;
    player1?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    player2?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    winner?: boolean | Prisma.Battle$winnerArgs<ExtArgs>;
};
export type $BattlePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Battle";
    objects: {
        room: Prisma.$RoomPayload<ExtArgs>;
        question: Prisma.$QuestionPayload<ExtArgs>;
        player1: Prisma.$UserPayload<ExtArgs>;
        player2: Prisma.$UserPayload<ExtArgs>;
        winner: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        roomId: number;
        questionId: number;
        player1Id: string;
        player2Id: string;
        winnerId: string | null;
        startedAt: Date;
        endedAt: Date | null;
        status: string;
    }, ExtArgs["result"]["battle"]>;
    composites: {};
};
export type BattleGetPayload<S extends boolean | null | undefined | BattleDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BattlePayload, S>;
export type BattleCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BattleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BattleCountAggregateInputType | true;
};
export interface BattleDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Battle'];
        meta: {
            name: 'Battle';
        };
    };
    /**
     * Find zero or one Battle that matches the filter.
     * @param {BattleFindUniqueArgs} args - Arguments to find a Battle
     * @example
     * // Get one Battle
     * const battle = await prisma.battle.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BattleFindUniqueArgs>(args: Prisma.SelectSubset<T, BattleFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BattleClient<runtime.Types.Result.GetResult<Prisma.$BattlePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Battle that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BattleFindUniqueOrThrowArgs} args - Arguments to find a Battle
     * @example
     * // Get one Battle
     * const battle = await prisma.battle.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BattleFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BattleFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BattleClient<runtime.Types.Result.GetResult<Prisma.$BattlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Battle that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BattleFindFirstArgs} args - Arguments to find a Battle
     * @example
     * // Get one Battle
     * const battle = await prisma.battle.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BattleFindFirstArgs>(args?: Prisma.SelectSubset<T, BattleFindFirstArgs<ExtArgs>>): Prisma.Prisma__BattleClient<runtime.Types.Result.GetResult<Prisma.$BattlePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Battle that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BattleFindFirstOrThrowArgs} args - Arguments to find a Battle
     * @example
     * // Get one Battle
     * const battle = await prisma.battle.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BattleFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BattleFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BattleClient<runtime.Types.Result.GetResult<Prisma.$BattlePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Battles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BattleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Battles
     * const battles = await prisma.battle.findMany()
     *
     * // Get first 10 Battles
     * const battles = await prisma.battle.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const battleWithIdOnly = await prisma.battle.findMany({ select: { id: true } })
     *
     */
    findMany<T extends BattleFindManyArgs>(args?: Prisma.SelectSubset<T, BattleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BattlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Battle.
     * @param {BattleCreateArgs} args - Arguments to create a Battle.
     * @example
     * // Create one Battle
     * const Battle = await prisma.battle.create({
     *   data: {
     *     // ... data to create a Battle
     *   }
     * })
     *
     */
    create<T extends BattleCreateArgs>(args: Prisma.SelectSubset<T, BattleCreateArgs<ExtArgs>>): Prisma.Prisma__BattleClient<runtime.Types.Result.GetResult<Prisma.$BattlePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Battles.
     * @param {BattleCreateManyArgs} args - Arguments to create many Battles.
     * @example
     * // Create many Battles
     * const battle = await prisma.battle.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends BattleCreateManyArgs>(args?: Prisma.SelectSubset<T, BattleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Battles and returns the data saved in the database.
     * @param {BattleCreateManyAndReturnArgs} args - Arguments to create many Battles.
     * @example
     * // Create many Battles
     * const battle = await prisma.battle.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Battles and only return the `id`
     * const battleWithIdOnly = await prisma.battle.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends BattleCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BattleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BattlePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Battle.
     * @param {BattleDeleteArgs} args - Arguments to delete one Battle.
     * @example
     * // Delete one Battle
     * const Battle = await prisma.battle.delete({
     *   where: {
     *     // ... filter to delete one Battle
     *   }
     * })
     *
     */
    delete<T extends BattleDeleteArgs>(args: Prisma.SelectSubset<T, BattleDeleteArgs<ExtArgs>>): Prisma.Prisma__BattleClient<runtime.Types.Result.GetResult<Prisma.$BattlePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Battle.
     * @param {BattleUpdateArgs} args - Arguments to update one Battle.
     * @example
     * // Update one Battle
     * const battle = await prisma.battle.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends BattleUpdateArgs>(args: Prisma.SelectSubset<T, BattleUpdateArgs<ExtArgs>>): Prisma.Prisma__BattleClient<runtime.Types.Result.GetResult<Prisma.$BattlePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Battles.
     * @param {BattleDeleteManyArgs} args - Arguments to filter Battles to delete.
     * @example
     * // Delete a few Battles
     * const { count } = await prisma.battle.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends BattleDeleteManyArgs>(args?: Prisma.SelectSubset<T, BattleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Battles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BattleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Battles
     * const battle = await prisma.battle.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends BattleUpdateManyArgs>(args: Prisma.SelectSubset<T, BattleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Battles and returns the data updated in the database.
     * @param {BattleUpdateManyAndReturnArgs} args - Arguments to update many Battles.
     * @example
     * // Update many Battles
     * const battle = await prisma.battle.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Battles and only return the `id`
     * const battleWithIdOnly = await prisma.battle.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends BattleUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BattleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BattlePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Battle.
     * @param {BattleUpsertArgs} args - Arguments to update or create a Battle.
     * @example
     * // Update or create a Battle
     * const battle = await prisma.battle.upsert({
     *   create: {
     *     // ... data to create a Battle
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Battle we want to update
     *   }
     * })
     */
    upsert<T extends BattleUpsertArgs>(args: Prisma.SelectSubset<T, BattleUpsertArgs<ExtArgs>>): Prisma.Prisma__BattleClient<runtime.Types.Result.GetResult<Prisma.$BattlePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Battles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BattleCountArgs} args - Arguments to filter Battles to count.
     * @example
     * // Count the number of Battles
     * const count = await prisma.battle.count({
     *   where: {
     *     // ... the filter for the Battles we want to count
     *   }
     * })
    **/
    count<T extends BattleCountArgs>(args?: Prisma.Subset<T, BattleCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BattleCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Battle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BattleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BattleAggregateArgs>(args: Prisma.Subset<T, BattleAggregateArgs>): Prisma.PrismaPromise<GetBattleAggregateType<T>>;
    /**
     * Group by Battle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BattleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends BattleGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BattleGroupByArgs['orderBy'];
    } : {
        orderBy?: BattleGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BattleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBattleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Battle model
     */
    readonly fields: BattleFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Battle.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__BattleClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    room<T extends Prisma.RoomDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RoomDefaultArgs<ExtArgs>>): Prisma.Prisma__RoomClient<runtime.Types.Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    question<T extends Prisma.QuestionDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.QuestionDefaultArgs<ExtArgs>>): Prisma.Prisma__QuestionClient<runtime.Types.Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    player1<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    player2<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    winner<T extends Prisma.Battle$winnerArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Battle$winnerArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the Battle model
 */
export interface BattleFieldRefs {
    readonly id: Prisma.FieldRef<"Battle", 'Int'>;
    readonly roomId: Prisma.FieldRef<"Battle", 'Int'>;
    readonly questionId: Prisma.FieldRef<"Battle", 'Int'>;
    readonly player1Id: Prisma.FieldRef<"Battle", 'String'>;
    readonly player2Id: Prisma.FieldRef<"Battle", 'String'>;
    readonly winnerId: Prisma.FieldRef<"Battle", 'String'>;
    readonly startedAt: Prisma.FieldRef<"Battle", 'DateTime'>;
    readonly endedAt: Prisma.FieldRef<"Battle", 'DateTime'>;
    readonly status: Prisma.FieldRef<"Battle", 'String'>;
}
/**
 * Battle findUnique
 */
export type BattleFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Battle
     */
    select?: Prisma.BattleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Battle
     */
    omit?: Prisma.BattleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BattleInclude<ExtArgs> | null;
    /**
     * Filter, which Battle to fetch.
     */
    where: Prisma.BattleWhereUniqueInput;
};
/**
 * Battle findUniqueOrThrow
 */
export type BattleFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Battle
     */
    select?: Prisma.BattleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Battle
     */
    omit?: Prisma.BattleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BattleInclude<ExtArgs> | null;
    /**
     * Filter, which Battle to fetch.
     */
    where: Prisma.BattleWhereUniqueInput;
};
/**
 * Battle findFirst
 */
export type BattleFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Battle
     */
    select?: Prisma.BattleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Battle
     */
    omit?: Prisma.BattleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BattleInclude<ExtArgs> | null;
    /**
     * Filter, which Battle to fetch.
     */
    where?: Prisma.BattleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Battles to fetch.
     */
    orderBy?: Prisma.BattleOrderByWithRelationInput | Prisma.BattleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Battles.
     */
    cursor?: Prisma.BattleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Battles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Battles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Battles.
     */
    distinct?: Prisma.BattleScalarFieldEnum | Prisma.BattleScalarFieldEnum[];
};
/**
 * Battle findFirstOrThrow
 */
export type BattleFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Battle
     */
    select?: Prisma.BattleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Battle
     */
    omit?: Prisma.BattleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BattleInclude<ExtArgs> | null;
    /**
     * Filter, which Battle to fetch.
     */
    where?: Prisma.BattleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Battles to fetch.
     */
    orderBy?: Prisma.BattleOrderByWithRelationInput | Prisma.BattleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Battles.
     */
    cursor?: Prisma.BattleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Battles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Battles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Battles.
     */
    distinct?: Prisma.BattleScalarFieldEnum | Prisma.BattleScalarFieldEnum[];
};
/**
 * Battle findMany
 */
export type BattleFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Battle
     */
    select?: Prisma.BattleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Battle
     */
    omit?: Prisma.BattleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BattleInclude<ExtArgs> | null;
    /**
     * Filter, which Battles to fetch.
     */
    where?: Prisma.BattleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Battles to fetch.
     */
    orderBy?: Prisma.BattleOrderByWithRelationInput | Prisma.BattleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Battles.
     */
    cursor?: Prisma.BattleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Battles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Battles.
     */
    skip?: number;
    distinct?: Prisma.BattleScalarFieldEnum | Prisma.BattleScalarFieldEnum[];
};
/**
 * Battle create
 */
export type BattleCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Battle
     */
    select?: Prisma.BattleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Battle
     */
    omit?: Prisma.BattleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BattleInclude<ExtArgs> | null;
    /**
     * The data needed to create a Battle.
     */
    data: Prisma.XOR<Prisma.BattleCreateInput, Prisma.BattleUncheckedCreateInput>;
};
/**
 * Battle createMany
 */
export type BattleCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Battles.
     */
    data: Prisma.BattleCreateManyInput | Prisma.BattleCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Battle createManyAndReturn
 */
export type BattleCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Battle
     */
    select?: Prisma.BattleSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Battle
     */
    omit?: Prisma.BattleOmit<ExtArgs> | null;
    /**
     * The data used to create many Battles.
     */
    data: Prisma.BattleCreateManyInput | Prisma.BattleCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BattleIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * Battle update
 */
export type BattleUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Battle
     */
    select?: Prisma.BattleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Battle
     */
    omit?: Prisma.BattleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BattleInclude<ExtArgs> | null;
    /**
     * The data needed to update a Battle.
     */
    data: Prisma.XOR<Prisma.BattleUpdateInput, Prisma.BattleUncheckedUpdateInput>;
    /**
     * Choose, which Battle to update.
     */
    where: Prisma.BattleWhereUniqueInput;
};
/**
 * Battle updateMany
 */
export type BattleUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Battles.
     */
    data: Prisma.XOR<Prisma.BattleUpdateManyMutationInput, Prisma.BattleUncheckedUpdateManyInput>;
    /**
     * Filter which Battles to update
     */
    where?: Prisma.BattleWhereInput;
    /**
     * Limit how many Battles to update.
     */
    limit?: number;
};
/**
 * Battle updateManyAndReturn
 */
export type BattleUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Battle
     */
    select?: Prisma.BattleSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Battle
     */
    omit?: Prisma.BattleOmit<ExtArgs> | null;
    /**
     * The data used to update Battles.
     */
    data: Prisma.XOR<Prisma.BattleUpdateManyMutationInput, Prisma.BattleUncheckedUpdateManyInput>;
    /**
     * Filter which Battles to update
     */
    where?: Prisma.BattleWhereInput;
    /**
     * Limit how many Battles to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BattleIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * Battle upsert
 */
export type BattleUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Battle
     */
    select?: Prisma.BattleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Battle
     */
    omit?: Prisma.BattleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BattleInclude<ExtArgs> | null;
    /**
     * The filter to search for the Battle to update in case it exists.
     */
    where: Prisma.BattleWhereUniqueInput;
    /**
     * In case the Battle found by the `where` argument doesn't exist, create a new Battle with this data.
     */
    create: Prisma.XOR<Prisma.BattleCreateInput, Prisma.BattleUncheckedCreateInput>;
    /**
     * In case the Battle was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.BattleUpdateInput, Prisma.BattleUncheckedUpdateInput>;
};
/**
 * Battle delete
 */
export type BattleDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Battle
     */
    select?: Prisma.BattleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Battle
     */
    omit?: Prisma.BattleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BattleInclude<ExtArgs> | null;
    /**
     * Filter which Battle to delete.
     */
    where: Prisma.BattleWhereUniqueInput;
};
/**
 * Battle deleteMany
 */
export type BattleDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Battles to delete
     */
    where?: Prisma.BattleWhereInput;
    /**
     * Limit how many Battles to delete.
     */
    limit?: number;
};
/**
 * Battle.winner
 */
export type Battle$winnerArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
/**
 * Battle without action
 */
export type BattleDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Battle
     */
    select?: Prisma.BattleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Battle
     */
    omit?: Prisma.BattleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BattleInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=Battle.d.ts.map