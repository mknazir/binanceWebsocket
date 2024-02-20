import { Button, Chip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import './AddRemoveProducts.scss';
import { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

function Card({productData}) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  function renderActionButton() {
    if (windowWidth >= 768) {
      return actionButton;
    }

    if (actionButton === 'ADD') {
      return <AddIcon />;
    }

    return <DeleteIcon />;
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleDelete = () => {
    console.log('delete');
  };

  return (
    <div className="styleFX">
      <div className="menuItem">
        <div className="itemImage">
          <img src={productData.image} alt="" className="itemImageStyle" />
        </div>
        <div className="itemDetails">
          <div className="itemInfo">
            <Typography className="itemTitle">{productData.name}</Typography>
            <Typography className="itemSubtitle">{productData.description}</Typography>
          </div>

          <div className="itemPrice">
          <Typography>{productData.priceList[0].currency}</Typography>
            <Typography>{productData.priceList[0].value}</Typography>
            {isNonVeg && <Chip label={productData.tag[0]} onDelete={handleDelete} />}
          </div>
        </div>
        <div className="itemAction">
          {actionButton && (
            <Button
              className={
                actionButton === 'REMOVE' ? 'removeButton' : 'addButton'
              }
              onClick={onAction}
            >
              {renderActionButton()}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

Card.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  isNonVeg: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/require-default-props
  actionButton: PropTypes.string, // Text for the action button
  // eslint-disable-next-line react/require-default-props
  onAction: PropTypes.func,
};

export default Card;