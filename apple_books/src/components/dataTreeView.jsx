import React from 'react';
import {useHistory} from 'react-router-dom';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

export const DataTreeView = ({data, mainType, username}) => {
  const history = useHistory();
  const handleReviewForm = (doc) => {
    history.push({
      pathname: '/form',
      state: { data: doc }
    });
  };
 
  const renderTree = (doc, type=mainType) => {
    let label, contents, addReview, editReview;
    switch(type) {
      case 'book':
        addReview = !username || doc['reviews'].find(review => review.username === username) ?
        null : (<button onClick={() => handleReviewForm(doc)}>Add Review...</button>);
        label = (
          <div> 
            <img src={doc['book cover url']} alt='book cover' width="100" height="150"/>
            <a href={doc['book url']} style={{paddingLeft: '20px'}}>{doc['book title']} </a> 
            (Ratings: {doc['actual book Avg rating']})
            {addReview}
          </div>
        );
        contents = ( 
          <div>
            <div>Author Name: {doc['author name']}</div>
            <div>Genres: {doc['book genres']}</div>
            <div>Editorial Notes: {doc['book editorial notes']}</div>
          </div>
        );
        break;
      case 'subReview':
        editReview = doc['username'] === username ?
          (<button onClick={() => handleReviewForm(doc)}>Edit Review...</button>) : null;
        label = `Reviewed by: ${doc['username']} Rating: ${doc['rating']}`;
        contents = ( 
          <div>
            <div>On: {doc['updated on']}</div>
            <div>Review: {doc['review text']}</div>
            {editReview}
          </div>
        );
        break;
      case 'review':
        editReview = doc['username'] === username ?
          (<button onClick={() => handleReviewForm(doc)}>Edit Review...</button>) : null;
        label = `${doc['book']['book title']} Rating: ${doc['rating']}`;
        contents = ( 
          <div>
            <div style={{display: username ? 'inline' : 'none'}}>By: {doc['username']}</div>
            <div>On: {doc['updated on']}</div>
            <div>Review: {doc['review text']}</div>
            {editReview}
          </div>
        );
        break;
      default:
        label = '';
        contents = '';
    }
    const id = doc.id || doc._id;
    if (!id) {
      return null;
    }

    return (
      <TreeItem style={{marginTop: '50px'}} key={id} nodeId={id} label={label}>
        {contents}
        {Array.isArray(doc.reviews) ? doc.reviews.map((subDoc) => renderTree(subDoc, 'subReview')) : null}
      </TreeItem>
    );
  }

  return (
    <TreeView
      aria-label="rich object"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ 
        textAlign: 'left', 
        height: 250, 
        flexGrow: 1, 
        width: 800, 
        overflowX: 'hidden', 
        overflowY: 'auto' 
      }}
    >
      {renderTree(data)}
    </TreeView>
  );
}