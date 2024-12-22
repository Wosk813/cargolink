import AnnoucmentsWrapper from './annoucements-wrapper';
import AnnoucmentsHeader from './annoucments-header';

export default function Annoucments() {
  return (
    <div className='flex flex-col gap-4'>
      <AnnoucmentsHeader />
      <AnnoucmentsWrapper />
    </div>
  );
}
