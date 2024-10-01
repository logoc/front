import { withInstall } from '@/utils';
import './src/index.less';
import basicModal from './src/BasicModal.vue';
import viewModal from './src/ViewModal.vue';

export const BasicModal = withInstall(basicModal);
export const ViewModal = withInstall(viewModal);
export { useModalContext } from './src/hooks/useModalContext';
export { useModal, useModalInner } from './src/hooks/useModal';
export * from './src/typing';
