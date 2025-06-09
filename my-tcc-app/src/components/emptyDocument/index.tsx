import React from "react";
import * as S from "./styles";

const EmptyDocument: React.FC = () => {
  return (
    <S.Container testID="empty-document">
      <S.Text>Sem documentos cadastrados</S.Text>
    </S.Container>
  );
};

export default EmptyDocument;
