import React from "react";
import * as S from "./styles";
import { DocumentDetailScreenProps } from "../../models/navigation";

export default function DocumentDetails({navigation, route}: DocumentDetailScreenProps) {
  const { itemId } = route.params;
  console.log(itemId);
    return (
    <S.Container>
    </S.Container>
  );
}