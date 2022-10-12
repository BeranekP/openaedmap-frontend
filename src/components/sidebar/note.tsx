import { useTranslation } from "react-i18next";
import React, { FC } from "react";
import SpanNoData from "./spanNoData";

const NoteDescription: FC<NoteProps> = ({ note }) => {
    if (note) {
        return <span className="has-text-weight-medium">{note}</span>;
    }
    return <SpanNoData />;
};

export const NoteField: FC<NoteProps> = ({ note }) => {
    const { t } = useTranslation();

    return (
        <p className="has-text-weight-light">
            {`${t("sidebar.note")}: `}
            <NoteDescription note={note} />
        </p>
    );
};

interface NoteProps {
    note: string,
}