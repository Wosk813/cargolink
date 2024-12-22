import AnnoucmentsFilters from './annoucments-filter';
import AnnoucementsMapButt from './annoucments-map';

export default function AnnoucmentsHeader() {
  return (
    <div className='flex flex-col gap-4'>
      <AnnoucmentsFilters />
      <AnnoucementsMapButt />
    </div>
  );
}
