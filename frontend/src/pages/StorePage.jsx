import { useParams } from 'react-router-dom';
import StoreShell from '../core/StoreShell';
import StoreProducts from './StoreProducts';

export default function StorePage() {
  const { handle } = useParams();

  return (
    <StoreShell handle={handle}>
      <StoreProducts handle={handle} />
    </StoreShell>
  );
}
