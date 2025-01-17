import React, {FC} from 'react';
import { Button, Footer } from 'react-bulma-components';
import { useTranslation } from 'react-i18next';
import Icon from '@mdi/react'
import {mdiCancel, mdiArrowRightBold, mdiMapMarkerPlus} from '@mdi/js'
import './footer.css'
import {ButtonsType} from "../model/buttonsType";


const FooterDiv: FC<FooterDivProps> = ({ openForm, mobileStepOne, mobileCancel, mobileStepTwo, buttonsConfiguration }) => {
    const { t } = useTranslation();

    const addAedButtons = (
        <>
        <div className='is-hidden-mobile'>
            <Button color={'success'} mt={1} ml={2} className='has-text-weight-light' onClick={openForm}>
                <Icon path={mdiMapMarkerPlus} className='icon mr-2' />
                {t('footer.add_aed')}
            </Button>
        </div>
        <div className='is-hidden-tablet'>
            <Button color={'success'} mt={1} ml={2} className='has-text-weight-light' onClick={mobileStepOne}>
                <Icon path={mdiMapMarkerPlus} className='icon mr-2' />
                {t('footer.add')}
            </Button>
        </div>
        </>
    );
    const mobileStepOneButtons = (
        <>
            <Button color={'error'} mt={1} ml={2} className='has-text-weight-light' onClick={mobileCancel}>
                <Icon path={mdiCancel} className='icon mr-2' />
                {t('footer.cancel')}
            </Button>
            <Button color={'success'} mt={1} ml={2} className='has-text-weight-light' onClick={mobileStepTwo}>
                <Icon path={mdiArrowRightBold} className='icon mr-2' />
                {t('footer.continue')}
            </Button>
        </>
    );
    function getFooterButtons(buttonConfigurationType: ButtonsType) {
        switch (buttonConfigurationType) {
            case ButtonsType.None: return null;
            case ButtonsType.AddAED: return addAedButtons;
            case ButtonsType.MobileStep1: return mobileStepOneButtons;
        }
    }

    if (buttonsConfiguration === ButtonsType.None) return <></>;
    else return (
        <Footer className='footer-div'>
            <div className='bottom-bar-buttons'>
                {getFooterButtons(buttonsConfiguration)}
            </div>
        </Footer>
    )
};

interface FooterDivProps {
    openForm: () => void,
    mobileStepOne: () => void,
    mobileCancel: () => void,
    mobileStepTwo: () => void,
    buttonsConfiguration: number,
}

export default FooterDiv;